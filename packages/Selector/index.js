import Selector from './src/main.vue';

/* istanbul ignore next */
// eslint-disable-next-line func-names
Selector.install = function (Vue) {
  Vue.component(Selector.name, Selector);
};

export default Selector;
