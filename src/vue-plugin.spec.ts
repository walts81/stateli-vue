import plugin from './vue-plugin';

describe('StateliVuePlugin', () => {
  test('it works', () => {
    let called = false;
    const mixin = (mixin: { beforeCreate: () => void }) => {
      called = !!mixin;
    };
    const vue: any = { mixin };
    plugin(vue);
    expect(called).toBe(true);
  });
});
