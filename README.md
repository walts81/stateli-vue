# Stateli

[![Build Status](https://travis-ci.com/walts81/stateli-vue.svg?branch=master)](https://travis-ci.com/walts81/stateli-vue)
[![Coverage Status](https://coveralls.io/repos/github/walts81/stateli-vue/badge.svg)](https://coveralls.io/github/walts81/stateli-vue)

A [Vue][vue] plugin to enable [Stateli][stateli] to work with [Vue DevTools][vuedevtools].

### Installation

Install stateli-vue with npm.

```sh
$ npm install stateli --save
```

### Usage

```javascript
import Vue from 'vue';
import { StateliStore } from 'stateli';
import StateliVue from 'stateli-vue';
import App from './App.vue'; // <-- your main app component

Vue.use(StateliVuePlugin);

const store = new StateliStore({
  actions: [],
  mutations: [],
  getters: [],
  state: {},
});

const vueInstance = new Vue({
  store,
  render: h => h(App),
});
```

## License

[MIT](LICENSE)

[vue]: https://vuejs.org
[vuedevtools]: https://github.com/vuejs/vue-devtools
[stateli]: https://github.com/walts81/stateli
