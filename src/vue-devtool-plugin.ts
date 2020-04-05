import { IStateliStore } from 'stateli';
import Vue from 'vue';

const target: any = typeof window !== 'undefined' ? window : typeof (global as any) !== 'undefined' ? global : {};
const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

export default (store: IStateliStore<any>) => {
  if (!devtoolHook) return;

  (store as any)._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', targetState => {
    (store as any).state = targetState;
  });

  store.subscribe(s => {
    const mutation = s.type;
    const state = (s as any).state;
    if (!(store as any).replaceState) {
      (store as any).replaceState = x => (store.state = x);
    }
    const computed: any = {};
    for (const mod of (store as any).modules) {
      for (const g of mod.getters) {
        computed[g.type] = () => g.getValue(mod.state);
      }
    }
    const oldVm = (store as any)._vm;
    const silent = Vue.config.silent;
    Vue.config.silent = true;
    (store as any)._vm = new Vue({
      data: {
        $$state: s.state,
      },
      computed,
    });
    Vue.config.silent = silent;
    if (oldVm) {
      oldVm._data.$$state = null;
      Vue.nextTick(() => oldVm.$destroy());
    }
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
};
