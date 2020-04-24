<template>
    <div class="text-center">
        <h2>Open deur</h2>
        <p>
            Wat weet je eigenlijk van....?
        </p>
        <b-button :disabled="gestart" @click="starten()">Starten</b-button>
        <h3>{{ gestart ? currentVraag : '' }}</h3>
        <h4>{{ gestart ? currentAntwoord : '' }}</h4>
        <div>
            <b-button variant="warning" @click="geefAntwoord(false)" :disabled="!gestart || beantwoord" v-show="!beantwoord || laatsteAntwoordGoed == false">
                <font-awesome-icon :icon="['fas', 'times']" size="lg" class="mr-2" /> Fout
            </b-button>
            <b-button variant="success" class="ml-2" @click="geefAntwoord(true)" :disabled="!gestart || beantwoord" v-show="!beantwoord || laatsteAntwoordGoed == true">
                <font-awesome-icon :icon="['fas', 'check']" size="lg" class="mr-2" /> Goed
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
import VragenTable from "../../components/ronde1/VragenTable";
import { mapGetters } from "vuex"

export default {
    components: {
        VragenTable
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
            vraagGestartDoor: null
        }
    },
    computed: {
       ...mapGetters('spelers', ['actieveSpeler', 'volgendeSpeler']),
        vragen() {
            return this.speldata.vragen
        },
        currentVraag() {
            return this.currentVraagObj.vraag;
        },
        currentAntwoord() {
            return this.currentVraagObj.antwoord;
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
        }
    }
}
</script>

<style>

</style>
