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
      initVm(storeAny);
    };
  }

  const oldVm: Vue = storeAny._vm;

  const computed: any = {};
  const mutations: any = {};
  for (const mod of store.modules) {
    for (const g of mod.getters) {
      const key = mod.namespaced ? `${mod.name}/${g.type}` : g.type;
      Object.defineProperty(computed, key, {
        get: () => {
          return g.getValue(mod.state, store.getter, store.state);
        },
        enumerable: true,
      });
    }
    for (const m of mod.mutations) {
      const key = mod.namespaced ? `${mod.name}/${m.type}` : m.type;
      Object.defineProperty(mutations, key, {
        value: (state: any, payload: any) => {
          if (!state || !!state) {
            m.commit(storeAny._vm.$$state, payload);
          }
        }
      });
    }
  }
  storeAny._mutations = mutations;

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

const forceUpdate = (vm: Vue) => {
  vm.$forceUpdate();
  for (const c of vm.$children) {
    forceUpdate(c);
  }
};

export default (vueInstance: Vue, store: IStateliStore<any>) => {
  if (!devtoolHook) return;

  initVm(store);
  store.subscribeToMutation(() => forceUpdate(vueInstance.$root));

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', targetState => {
    (store as any).replaceState(targetState);
  });

  store.subscribeToMutation(s => {
    const state = s.state;
    devtoolHook.emit('vuex:mutation', s, state);
  }, { prepend: true });

  store.subscribeToAction(s => {
    const state = s.state;
    devtoolHook.emit('vuex:action', s, state);
  }, { prepend: true });
};
