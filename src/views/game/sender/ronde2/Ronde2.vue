<template>
    <div class="text-center">
        <h2>Open deur</h2>
        <p>
            Wat weet je eigenlijk van....?
        </p>
        <b-button :disabled="gestart" @click="starten()">Start ronde 2</b-button>
        <h3>{{ gestart ? currentIntroductie : '' }}</h3>
        <h4>{{ gestart ? currentVraag : '' }}</h4>
        <div v-if="gestart">
            <TimerToggle 
                v-model="timerLoopt"
                class="mb-4"
                :speler="actieveSpeler"
                @start="timerLoopt = true"
                @pas="timerLoopt = false"
            />

            <b-button 
                v-for="(antwoord, index) in currentAntwoorden" 
                :key="'antwoord'+index"
                :disabled="!timerLoopt || antwoordenGevondenDoor[index] > 0"
                @click="setAntwoordGevonden(index)"
                block
            >
                <font-awesome-icon :icon="['fas', 'check']" v-if="antwoordenGevondenDoor[index]" />
                {{ antwoord }}
                <span v-if="antwoordenGevondenDoor[index]">
                    [{{ getSpeler(antwoordenGevondenDoor[index]).naam }}]
                </span>
            </b-button>
            
        </div>
        
        <div v-if="beantwoord" class="mt-4">
            <b-button variant="primary" @click="$emit('rondeKlaar')" v-if="isLaatsteVraag">
                <font-awesome-icon :icon="['fas', 'arrow-right']" size="lg" class="mr-2" /> 
                Ronde 2
            </b-button>
            <b-button variant="info" @click="volgendeVraag()" v-else-if="laatsteAntwoordGoed || volgendeSpelerHeeftVraagGestart" class="mt-4">
                <font-awesome-icon :icon="['fas', 'arrow-right']" size="lg" class="mr-2" /> 
                Volgende vraag
            </b-button>
            <b-button variant="info" @click="volgendeKans()" v-else class="mt-4">
                <font-awesome-icon :icon="['fas', 'arrow-right']" size="lg" class="mr-2" /> 
                Volgende speler
            </b-button>
        </div>
    </div>
</template>

<script>
// import VragenTable from "../../components/ronde1/VragenTable";
import TimerToggle from "../TimerToggle";
import { mapGetters } from "vuex"

export default {
    components: {
        TimerToggle
    },
    props: {
        speldata: Object
    },
    data() {
        return {
            currentVraagNum: undefined,
            vragenStatus: {},
            beantwoord: false,
            laatsteAntwoordGoed: undefined,
            vraagGestartDoor: null,
            antwoordenGevondenDoor: {},
            timerLoopt: false,
        }
    },
    computed: {
       ...mapGetters('spelers', ['actieveSpeler', 'volgendeSpeler', 'getSpeler']),
        vragen() {
            return this.speldata.vragen
        },
        currentVraag() {
            return this.currentVraagObj.vraag;
        },
        currentIntroductie() {
            return this.currentVraagObj.introductie;
        },
        currentAntwoorden() {
            return this.gestart ? this.currentVraagObj.antwoorden : undefined;
        },
        currentVraagObj() {
            return this.vragen[this.currentVraagNum - 1];
        },
        currentVraagPunten(){
            return this.currentVraagNum % 3 == 0
        },
        gestart(){
            return this.currentVraagNum > 0;
        },
        isLaatsteVraag(){
            return this.currentVraagNum >= 9;
        },
        volgendeSpelerHeeftVraagGestart(){
            return this.volgendeSpeler.spelerId == this.vraagGestartDoor;
        }
    },
    methods: {
        starten(){
            this.$store.dispatch('spelers/volgendeSpeler')
            this.currentVraagNum = 1;
            this.vraagGestartDoor = this.actieveSpeler.spelerId;
            this.resetGevonden();
        },
        geefAntwoord(goed) {
            this.beantwoord = true;
            if(goed && this.currentVraagPunten){
                this.$store.dispatch('spelers/geefPuntenHuidigeSpeler', 10);
            }
            this.laatsteAntwoordGoed = goed;
        },
        volgendeKans() {
            this.$store.dispatch('spelers/volgendeSpeler')
            this.beantwoord = false;
            this.laatsteAntwoordGoed = undefined;
        },
        volgendeVraag() {
            this.beantwoord = false;
            this.laatsteAntwoordGoed = undefined;
            this.vraagGestartDoor = this.actieveSpeler.spelerId;

            this.currentVraagNum++;
            this.resetGevonden();
        },
        resetGevonden(){
            let antwoordenGevondenDoor = {};
            this.currentAntwoorden.forEach((antwoord, index) => {
                antwoordenGevondenDoor[index] = null
            });
            this.$set(this, 'antwoordenGevondenDoor', antwoordenGevondenDoor);
        },
        setAntwoordGevonden(index){
            this.antwoordenGevondenDoor[index] = this.actieveSpeler.spelerId;
            let onbeantwoord = this.currentAntwoorden.find((antwoord, index) => {
                return this.antwoordenGevondenDoor[index] === null
            });
            this.$store.dispatch('spelers/geefPuntenHuidigeSpeler', 10);

            if(onbeantwoord){
                // Er is een antwoord nog niet gevonden, niks veranderden
            }
            else{
                // Stop de timer
                this.timerLoopt = false
            }
        }
    }
}
</script>

<style>

</style>
