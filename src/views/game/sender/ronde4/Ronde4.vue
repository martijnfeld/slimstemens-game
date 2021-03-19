<template>
    <div class="text-center">
        <h2>Gallerij</h2>
        
        <h3>{{  currentVraagObj.thema }}</h3>
        <div v-if="currentVraagGestartDoorCurrentSpeler">
            <div style="height:40vh; margin: auto;">
                <img 
                    v-for="(afbeelding, afbeeldingIndex) in currentVraagObj.afbeeldingen"
                    :key="'afbeelding-'+afbeeldingIndex"
                    :src="afbeelding.afbeeldingUrl" 
                    v-show="afbeeldingIndex == currentAfbeeldingIndex"
                    class="m-auto"
                    style="max-width: 100%; max-height: 100%;"
                />
            </div>
            {{ currentAfbeelding.woord }} ({{ currentAfbeeldingIndex }}/{{ numAfbeeldingen }})
            <b-button-group>
                <b-button variant="success" @click="currentAfbeeldingOk()" :disabled="!timerLoopt">Ok</b-button>
                <b-button variant="warning" @click="currentFotoPas()" :disabled="!timerLoopt">Pas</b-button>
            </b-button-group>
        </div>
        <div v-else>
            <ul
                class="list-unstyled"
            >
                <li
                    v-for="(afbeelding, afbeeldingIndex) in currentVraagObj.afbeeldingen"
                    :key="'afbeeldingknop-'+afbeeldingIndex"
                >
                    <b-button 
                        @click="setGevonden(groep, groepIndex)"
                        :disabled="gevondenGroepen[groepIndex] == true || !timerLoopt"
                    >
                        <font-awesome-icon :icon="['fas', 'check']" v-if="antwoordenGevondenDoor[groepIndex]" />
                        {{ afbeelding.woord }}
                        <span v-if="antwoordenGevondenDoor[groepIndex]">
                            [{{ getSpeler(antwoordenGevondenDoor[groepIndex]).naam }}]
                        </span>
                    </b-button>
                </li>
            </ul>
        </div>

        <div>
            <TimerToggle 
                v-model="timerLoopt"
                class="mb-4"
                :disabled="vraagKlaar"
                :speler="actieveSpeler"
                @start="startTimer()"
                @pas="pas()"
            />
            
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
            vraagGestartDoor: {},

            currentAfbeeldingIndex: null
        }
    },
    computed: {
       ...mapGetters('spelers', ['actieveSpeler', 'volgendeSpeler', 'getSpeler', 'timerLoopt']),
       ...mapState('spelers', ['spelers']),
        vragen() {
            return this.speldata.vragen
        },
        currentIntroductie() {
            return this.currentVraagObj.introductie;
        },
        currentVraagGestartDoor() {
            return this.vraagGestartDoor[this.currentVraagIndex];
        },
        currentVraagGestartDoorCurrentSpeler(){
            return this.currentVraagGestartDoor === this.actieveSpeler.spelerId;
        },
        currentVraagObj() {
            return this.vragen[this.currentVraagIndex];
        },
        numAfbeeldingen(){
            return this.currentVraagObj.afbeeldingen.length
        },
        vraagActief(){
            return this.currentVraagIndex !== null;
        },
        volgendeSpelerHeeftVraagGestart(){
            return this.volgendeSpeler.spelerId == this.currentVraagGestartDoor;
        },
        alleSpelersGeweest(){
            var spelersGeweest = Object.values(this.vraagGestartDoor)
            
            return !this.spelers.some(speler => {
                // Komt de speler voor in de lijst met spelers die al aan de beurt is geweest?
                var spelerIsGeweest = spelersGeweest.some(spelerId => spelerId == speler.spelerId)
                return !spelerIsGeweest
            });
        },
        currentAfbeelding(){
            return this.currentVraagObj.afbeeldingen[this.currentAfbeeldingIndex]
        }
    },
    methods: {
        ...mapActions('spelers', ['stopTimer', 'startTimer']),
        currentAfbeeldingOk(){
            this.antwoordenGevondenDoor[this.currentAfbeeldingIndex] = this.actieveSpeler.spelerId;
            this.currentAfbeeldingIndex++;
        },
        currentFotoPas(){
            this.currentAfbeeldingIndex++;
        },
        volgendeFotoOfStop(){
            if(this.currentAfbeeldingIndex + 1 >= this.numAfbeeldingen){
                // Was de laatste afbeelding, stop de tijd
                this.stopTimer();
                this.$store.dispatch('spelers/volgendeSpeler');
            }
            else{
                // Volgende afbeelding
                this.currentAfbeeldingIndex++;
            }
        },
        startVraag(){
            if(this.currentVraagIndex === null){
                this.currentVraagIndex = 0;
                // TODO: kies speler met minste tijd
            }
            else{
                this.currentVraagIndex++;
            }
            this.currentAfbeeldingIndex = 0;
            this.resetGevonden();
            this.$set(this.vraagGestartDoor, this.currentVraagIndex, parseInt(this.actieveSpeler.spelerId));
            this.vraagKlaar = false;
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
            this.currentVraagObj.afbeeldingen.forEach((antwoord, index) => {
                antwoordenGevondenDoor[index] = null
            });
            this.$set(this, 'antwoordenGevondenDoor', antwoordenGevondenDoor);
        },
        setAntwoordGevonden(index){
            this.antwoordenGevondenDoor[index] = this.actieveSpeler.spelerId;
            let onbeantwoord = this.currentAntwoorden.find((antwoord, index) => {
                return this.antwoordenGevondenDoor[index] === null
            });
            this.$store.dispatch('spelers/geefPuntenHuidigeSpeler', 15);

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
    },
    created(){
        // TODO: speler met minste tijd laten starten
        this.startVraag();
    }
}
</script>

<style>

</style>
