import FormActionFactory from './actions/FormActionFactory';
import DateConverter from './converters/DateConverter';
import ButtonManager from './buttons/ButtonManager';
import Field from './fields/Field';

export default class UnsubscribeForm {
  #selector;

  #container;

  #form;

  #fields = [];

  #buttonManager;

  #message;

  #url;

  #stage = 1;

  #data;

  constructor(selector) {
    this.#selector = selector;
    this.#container = document.querySelector(this.#selector);

    if (this.#container) {
      this.#form = this.#container.querySelector('form');
      this.#message = this.#container.querySelector(`${this.#selector}-result`);
      this.#url = this.#form.getAttribute('action');
      const fields = this.#form.querySelectorAll(`${this.#selector}__field`);

      for (const field of fields) {
        this.#fields.push(new Field(field));
      }

      const buttonContainer = this.#container.querySelector(`${this.#selector}__btns`);
      this.#buttonManager = new ButtonManager(buttonContainer);

      this.#subscribeSubmitHandler();
    }
  }

  get url() {
    return this.#url;
  }

  get currentStage() {
    return this.#stage;
  }

  get data() {
    return this.#data;
  }

  #enableLoading() {
    this.#form.classList.add('loading');
  }

  #disableLoading() {
    this.#form.classList.remove('loading');
  }

  getFields() {
    return this.#fields;
  }

  showErrorOnField(name, message) {
    for (const field of this.#fields) {
      if (field.name === name) {
        field.showError(message);
        break;
      }
    }
  }

  #hideAllErrorOnFields() {
    for (const field of this.#fields) {
      field.hideError();
    }
  }

  showMessage(message, isError = false) {
    this.#message.innerText = message;
    this.#message.classList.add('act');

    if (isError) {
      this.#message.classList.add('error');
    } else {
      this.#message.classList.remove('error');
    }
  }

  hideMessage() {
    this.#message.classList.remove('act');
    this.#message.classList.remove('error');
    this.#message.innerText = '';
  }

  getUserDataSuccess(name, date, token) {
    const localDate = new DateConverter().convertToLocalString(date);
    const message = `${name}, після скасування підписки доступ для вас до клубу Анни Кушнерук буде
      закритий ${localDate} Щоб підтвердити скасування, натисніть на кнопку "Підтверджую".`;

    this.showMessage(message);
    this.#buttonManager.switchButtons();
    this.#data = { name, date, token };
    this.#stage = 2;
  }

  unsubscribeUserSuccess() {
    const { date } = this.#data;
    const localDate = new DateConverter().convertToLocalString(date);
    const message = `Доступ буде закритий ${localDate} До цієї дати ви можете користуватися всіма привілеями клубу.`;

    this.showMessage(message);
    this.#buttonManager.hideButtons();
  }

  #subscribeSubmitHandler() {
    this.#form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formAction = FormActionFactory.getStageAction(this);

      if (formAction) {
        this.#hideAllErrorOnFields();
        this.#enableLoading();
        this.hideMessage();
        this.#buttonManager.disableButtons();

        formAction
          .execute()
          .then(([callback, ...args]) => {
            callback.call(this, ...args);
          })
          .catch((error) => {
            this.showMessage(error.message, true);
          })
          .finally(() => {
            this.#buttonManager.enableButtons();
            this.#disableLoading();
          });
      }
    });
  }
}
