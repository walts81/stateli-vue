import Vue from 'vue';

let _vue: any;

function vuexInit(this: any) {
  const $this: any = this;
  const options = $this.$options;
  if (options.store) {
    this.$store = typeof options.store === 'function' ? options.store() : options.store;
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store;
  }
}

export default (vue: typeof Vue) => {
  if (_vue && vue === _vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[stateli] already installed. Vue.use(StateliVue) should be called only once.');
    }
    return;
  }
  _vue = vue;
  vue.mixin({ beforeCreate: vuexInit });
};
