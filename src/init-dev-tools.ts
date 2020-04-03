import Vue from 'vue';
import devtoolPlugin from './vue-devtool-plugin';
import { IStateliStore } from 'stateli';

let devtoolsInited = false;

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
};
