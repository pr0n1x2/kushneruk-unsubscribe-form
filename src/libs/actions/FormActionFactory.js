import GetUserDataAction from './GetUserDataAction';
import UnsubscribeUserAction from './UnsubscribeUserAction';

export default class FormActionFactory {
  static getStageAction(form) {
    switch (form.currentStage) {
      case 1: return new GetUserDataAction(form);
      case 2: return new UnsubscribeUserAction(form);
      default: return null;
    }
  }
}
