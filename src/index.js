import '@babel/polyfill';
import './styles/main.scss';
import UnsubscribeForm from './libs/UnsubscribeForm';

window.addEventListener('DOMContentLoaded', () => {
  const run = () => {
    new UnsubscribeForm('.kushneruk');
  };

  run();
});
