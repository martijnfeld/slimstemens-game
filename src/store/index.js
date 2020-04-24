import Vue from 'vue'
import Vuex from 'vuex'

const spelersModule = {
  namespaced: true,
  state: {
    spelers: [],
    actieveSpelerId: null
  },
  getters: {
    isActieveSpeler: (state, getters) => spelerId => {
      console.log(state.actieveSpelerId, spelerId)
      return state.actieveSpelerId == spelerId
    },
    getSpeler: (state, getters) => (spelerId) => state.spelers.find(speler => speler.spelerId == spelerId),
    volgendeSpeler: (state, getters) => {
      let volgendeSpeler;
      if(state.actieveSpelerId){
        let index = state.spelers.findIndex(speler => speler.spelerId == state.actieveSpelerId);
        volgendeSpeler = state.spelers[index + 1];
      }

      return volgendeSpeler === undefined ? state.spelers[0] : volgendeSpeler;
    },
    actieveSpeler: (state, getters) => getters.getSpeler(state.actieveSpelerId)
  },
  mutations: {
    addSpeler: (state, speler) => {
      state.spelers.push(speler)
    },
    setActieveSpeler: (state, spelerId) => {
      state.actieveSpelerId = spelerId;
    },
  },
  actions: {
    geefPuntenHuidigeSpeler(context, punten){
      context.dispatch('geefPuntenSpeler', { punten: punten, spelerId: context.state.actieveSpelerId})
    },
    geefPuntenSpeler(context, {spelerId, punten}){
      console.log("GEEF " + punten + " AAN " + spelerId)
      context.getters.getSpeler(spelerId).tijd += parseInt(punten)
    },
    setSpelers(context, spelerNamen){
      spelerNamen.forEach(spelerNaam => {
        let spelerId = context.state.spelers.length + 1;
        context.commit('addSpeler', {
            spelerId: spelerId,
            naam: spelerNaam,
            tijd: 0
        });
      });
    },
    volgendeSpeler(context){
      console.log(context.getters.volgendeSpeler.spelerId)
      context.commit('setActieveSpeler', context.getters.volgendeSpeler.spelerId)
    }
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    spelers: spelersModule
  }
})
