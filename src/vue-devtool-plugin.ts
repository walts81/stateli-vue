import { IStateliStore } from 'stateli';

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
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
};
