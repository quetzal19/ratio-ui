import Button from './src/main.vue';

/* istanbul ignore next */
// eslint-disable-next-line func-names
Button.install = function (Vue) {
  Vue.component(Button.name, Button);
};

export default Button;
