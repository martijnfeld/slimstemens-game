<template>
    <b-container style="height: 100%;">
        <transition name="fade" mode="out-in">
            <div v-if="!gestart" :key="'ifgestart1'" class="text-center">
                <h1>Game starten</h1>

                <ConnectBtn v-if="!presentationData.connection" />
                
                <div>
                    <SetSpelers v-model="spelersValue" />
                    <b-button :disabled="!spelersValue" @click="startGame()">Starten!</b-button>
                </div>
            </div>
            <div v-else :key="'ifgestart2'" class="d-flex flex-column py-2">
                <h1 class="text-center mxb-4">Ronde {{ ronde }}</h1>
                <transition name="fade" mode="out-in">
                    <component :is="'ronde'+ronde" @rondeKlaar="ronde++" :speldata="game.speldata['ronde_'+ronde]" class="my-auto" />
                </transition>
                
                <b-form-radio-group id="btn-radios-2" v-model="ronde" :options="[
                    {text: 1, value: 1},
                    {text: 2, value: 2},
                    {text: 3, value: 3},
                    {text: 4, value: 4}
                ]" buttons button-variant="outline-primary" size="lg" name="radio-btn-outline">

                </b-form-radio-group>
                <Spelers :spelers="spelers" class="mt-auto mb-2" />
            </div>
            

        </transition>
    </b-container>
</template>
<script>
import PresentationService from '../../../services/presentation'
import Spelers from '../components/Spelers'
import ConnectBtn from './ConnectBtn';
import SetSpelers from './SetSpelers';
import Ronde1 from './ronde1/Ronde1';
import Ronde2 from './ronde2/Ronde2';
import Ronde3 from './ronde3/Ronde3';
import Ronde4 from './ronde4/Ronde4';
import game from '@/games/game_1.json';
import { mapActions, mapState } from 'vuex';

export default {
  name: "Sender",
  components: { 
      ConnectBtn, 
      SetSpelers, 
      
      Ronde1, 
      Ronde2, 
      Ronde3, 
      Ronde4, 
      
      Spelers 
    },
  data(){
      return {
          numSpelers: 2,
          gestart: false,
          ronde: 1,
          spelersValue: undefined,
          presentationData: {
              connection: undefined,
          },
          game: game
      }
  },
  computed: {
      ...mapState({ spelers: state => state.spelers.spelers }),
  },
  methods: {
      connectScreen(){
          this.verbinden = true
          PresentationService.connect().finally(ok => {
              this.verbinden = false
          });
      },
      
      ...mapActions('spelers', ['setSpelers']),
      startGame(){
          this.setSpelers(this.spelersValue)
          this.gestart = true;
      }
  },
  created(){
      PresentationService.setup();
      PresentationService.onConnected(connection => {
          this.presentationData.connection = connection;
      })
  }
}
</script>
