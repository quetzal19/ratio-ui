import Radio from './src/main.vue';

/* istanbul ignore next */
// eslint-disable-next-line func-names
Radio.install = function (Vue) {
  Vue.component(Radio.name, Radio);
};

export default Radio;
