import Input from './src/main.vue';

/* istanbul ignore next */
// eslint-disable-next-line func-names
Input.install = function (Vue) {
  Vue.component(Input.name, Input);
};

export default Input;
