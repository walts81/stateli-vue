import Vue from 'vue';

export default (store: any, state: any) => {
  if (store.replaceState) {
    store.replaceState = x => (store.state = x);
  }
  const computed: any = {};
  for (const mod of store.modules) {
    for (const g of mod.getters) {
      computed[g.type] = () => g.getValue(mod.state);
    }
  }
  const oldVm = store._vm;
  const silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });
  Vue.config.silent = silent;
  if (oldVm) {
    oldVm._data.$$state = null;
    Vue.nextTick(() => oldVm.$destroy());
  }
};
