import Vue from 'vue';
import devtoolPlugin from './vue-devtool-plugin';
import { IStateliStore } from 'stateli';

let devtoolsInited = false;

const forceUpdate = (vm: Vue) => {
  vm.$forceUpdate();
  for (const c of vm.$children) {
    forceUpdate(c);
  }
};

export default (vueInstance: Vue, store: IStateliStore<any>) => {
  if (devtoolsInited) {
    return;
  }
  devtoolsInited = true;
  const $options: any = vueInstance.$options;
  const useDevTools = $options.devtools !== undefined ? $options.devtools : Vue.config.devtools;
  if (useDevTools) {
    devtoolPlugin(store);
  }
  store.subscribeToMutation(() => forceUpdate(vueInstance.$root));
};
