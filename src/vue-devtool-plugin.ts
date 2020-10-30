import Vue from 'vue';
import { IStateliStore } from 'stateli';

const target: any = typeof window !== 'undefined' ? window : typeof (global as any) !== 'undefined' ? global : {};
const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

const initVm = (store: IStateliStore<any>) => {
  const storeAny: any = store;
  if (!storeAny._devtoolHook) {
    storeAny._devtoolHook = devtoolHook;
  }
  if (!storeAny.replaceState) {
    storeAny.replaceState = x => {
      storeAny.state = x;
      storeAny._vm.$$state = x;
    };
  }

  const oldVm = storeAny._vm;

  const computed: any = {};
  for (const m of store.modules) {
    for (const g of m.getters) {
      const key = m.namespaced ? `${m.name}/${g.type}` : g.type;
      Object.defineProperty(computed, key, {
        get: () => {
          return g.getValue(m.state, store.getter, store.state);
        },
        enumerable: true,
      });
    }
  }
  const silent = Vue.config.silent;
  Vue.config.silent = true;
  storeAny._vm = new Vue({
    data: {
      $$state: store.state
    },
    computed,
  });
  Vue.config.silent = silent;

  if (!!oldVm) {
    Vue.nextTick(() => oldVm.$destroy());
  }
};

export default (store: IStateliStore<any>) => {
  if (!devtoolHook) return;

  initVm(store);

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', targetState => {
    (store as any).replaceState(targetState);
  });

  store.subscribeToMutation(s => {
    const mutation = s.type;
    const state = s.state;
    devtoolHook.emit('vuex:mutation', mutation, state);
  }, { prepend: true });

  store.subscribeToAction(s => {
    const action = s.type;
    const state = s.state;
    devtoolHook.emit('vuex:action', action, state);
  }, { prepend: true });
};
