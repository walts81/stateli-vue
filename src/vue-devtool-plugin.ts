import { IStateliStore } from 'stateli';

const target: any = typeof window !== 'undefined' ? window : typeof (global as any) !== 'undefined' ? global : {};
const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

export default (store: IStateliStore<any>) => {
  if (!devtoolHook) return;

  const storeAny: any = store;
  storeAny._devtoolHook = devtoolHook;
  if (!storeAny.replaceState) {
    storeAny.replaceState = x => (storeAny.state = x);
  }

  devtoolHook.emit('vuex:init', storeAny);

  devtoolHook.on('vuex:travel-to-state', targetState => {
    storeAny.replaceState(targetState);
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
