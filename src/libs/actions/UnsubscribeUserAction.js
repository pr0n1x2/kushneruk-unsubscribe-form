import FormAction from './FormAction';

export default class UnsubscribeUserAction extends FormAction {
  constructor(form) {
    super(form);
    this.fetch.setMethod('delete');
  }

  execute() {
    return new Promise((resolve) => {
      const { token } = this.form.data;
      const data = { token };

      this.fetch
        .sendRequest(data)
        .then((response) => {
          const message = 'Виникла непередбачена помилка, спробуйте оновити сторінку.';
          return this.checkResponseStatus(response, message);
        })
        .then(({ status: statusCode }) => {
          if (statusCode !== 'ok') {
            throw new Error('Виникла непередбачена помилка, зверніться до служби підтримки клієнтів.');
          }

          resolve([this.form.unsubscribeUserSuccess]);
        })
        .catch((error) => {
          resolve([this.form.showMessage, error.message, true]);
        });
    });
  }
}
