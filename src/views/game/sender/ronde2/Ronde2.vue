<template>
    <div class="text-center">
        <h2>Open deur</h2>
        <p>
            Wat weet je eigenlijk van....?
        </p>
        <div v-if="!vraagActief">
            <h3>{{ actieveSpeler.naam }}, kies een onderwerp:</h3>
            <b-button-group vertical>
                <b-button
                    v-for="(vraag, index) in vragen"
                    :key="index"
                    :disabled="!!onderwerpGekozenDoor[index]"
                    @click="startVraag(index)"
                >
                    {{ vraag.onderwerp }}
                    <span v-if="!!onderwerpGekozenDoor[index]">
                        [{{ getSpeler(onderwerpGekozenDoor[index]).naam }}]
                    </span>
                </b-button>
            </b-button-group>
        </div>
        <div v-if="vraagActief">
            <h3>{{ currentIntroductie }}</h3>
            <h4>{{ currentVraag }}</h4>
            <div>
                <TimerToggle 
                    v-model="timerLoopt"
                    class="mb-4"
                    :disabled="vraagKlaar"
                    :speler="actieveSpeler"
                    @start="startTimer()"
                    @pas="pas()"
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

            <div v-if="vraagKlaar" class="mt-4">
                <b-button variant="primary" @click="$emit('rondeKlaar')" v-if="alleSpelersGeweest">
                    <font-awesome-icon :icon="['fas', 'arrow-right']" size="lg" class="mr-2" /> 
                    Ronde 3
                </b-button>
                <b-button variant="info" @click="volgendeOnderwerp()" class="mt-4" v-else>
                    <font-awesome-icon :icon="['fas', 'arrow-right']" size="lg" class="mr-2" /> 
                    Volgende onderwerp
                </b-button>
            </div>
        </div>
        
    </div>
</template>

<script>
// import VragenTable from "../../components/ronde1/VragenTable";
import TimerToggle from "../TimerToggle";
import { mapGetters, mapState, mapActions } from "vuex"

export default {
    components: {
        TimerToggle
    },
    props: {
        speldata: Object
    },
    data() {
        return {
            currentVraagIndex: null,
            // Zijn alle antwoorden gevonden OF alle spelers aan de beurt geweest?
            vraagKlaar: false,
            // Per vraag bijhouden door welke speler het antwoord gevonden is
            antwoordenGevondenDoor: {},
            // Per vraag bijhouden door welke speler het onderwerp gekozen is (en die de vraag dus heeft gestart)
            onderwerpGekozenDoor: {},
        }
    },
    computed: {
       ...mapGetters('spelers', ['actieveSpeler', 'volgendeSpeler', 'getSpeler', 'timerLoopt']),
       ...mapState('spelers', ['spelers']),
        vragen() {
            return this.speldata.vragen
        },
        currentVraag() {
            return this.currentVraagObj.vraag;
        },
        currentIntroductie() {
            return this.currentVraagObj.introductie;
        },
        currentVraagGestartDoor() {
            return this.onderwerpGekozenDoor[this.currentVraagIndex];
        },
        currentAntwoorden() {
            return this.vraagActief ? this.currentVraagObj.antwoorden : undefined;
        },
        currentVraagObj() {
            return this.vragen[this.currentVraagIndex];
        },
        vraagActief(){
            return this.currentVraagIndex !== null;
        },
        volgendeSpelerHeeftVraagGestart(){
            return this.volgendeSpeler.spelerId == this.currentVraagGestartDoor;
        },
        alleSpelersGeweest(){
            var spelersGeweest = Object.values(this.onderwerpGekozenDoor)
            
            return !this.spelers.some(speler => {
                // Komt de speler voor in de lijst met spelers die al aan de beurt is geweest?
                var spelerIsGeweest = spelersGeweest.some(spelerId => spelerId == speler.spelerId)
                return !spelerIsGeweest
            });
        }
    },
    methods: {
        ...mapActions('spelers', ['stopTimer', 'startTimer']),
        startVraag(index){
            // this.$store.dispatch('spelers/volgendeSpeler')
            // this.currentVraagIndex = 0;
            // this.vraagGestartDoor = this.actieveSpeler.spelerId;
            // this.resetGevonden();
            this.$set(this.onderwerpGekozenDoor, index, parseInt(this.actieveSpeler.spelerId));
            this.currentVraagIndex = index;
            this.vraagKlaar = false;
            this.resetGevonden();
        },
        volgendeOnderwerp() {
            this.currentVraagIndex = null;
        },
        pas(){
            // this.timerLoopt = false;
            this.stopTimer()
            if(this.volgendeSpelerHeeftVraagGestart){
                // Alle spelers hebben deze vraag gespeeld. We gaan door naar de volgende vraag
                this.vraagKlaar = true;
            }
            else{
                this.$store.dispatch('spelers/volgendeSpeler')

            }
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
                // this.timerLoopt = false;
                this.stopTimer()
                this.vraagKlaar = true;

            }
        }
    }
}
</script>

<style>

</style>
