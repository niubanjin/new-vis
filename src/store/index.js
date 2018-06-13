import Vuex from 'vuex'
import Vue from 'vue'
// import IndexStore from './analysis/IndexStore'
// import ConnectStore from './analysis/connectStore'
import Settins from './analysis/settings'
import NiubanjinStore from './analysis/niubanjinStore'
import Email from './analysis/email'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
      // IndexStore,
      // ConnectStore,
    NiubanjinStore,
    Settins,
    Email
  }
});
