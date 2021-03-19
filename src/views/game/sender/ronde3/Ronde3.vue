<template>
    <div class="text-center">
        <h2>Puzzel</h2>
        <div v-if="puzzelData">
            <div>
                <WoordenTable 
                    mode="sender"
                    :woorden="puzzelData"
                    :gevonden="gevondenGroepen"
                />
                <TimerToggle 
                    v-model="timerLoopt"
                    class="mb-4"
                    :disabled="vraagKlaar"
                    :speler="actieveSpeler"
                    @start="startTimer()"
                    @pas="pas()"
                />
                <b-row>
                    <b-col
                        v-for="(groep, groepIndex) in currentVraag"
                        :key="'groep_'+groepIndex"
                        :class="'text-groep-'+groepIndex"
                    >
                        <h4>{{ groep.sleutelwoord }}</h4>
                        <b-button 
                            @click="setGevonden(groep, groepIndex)"
                            :disabled="gevondenGroepen[groepIndex] == true || !timerLoopt"
                        >
                            <font-awesome-icon :icon="['fas', 'check']" v-if="antwoordenGevondenDoor[groepIndex]" />
                            Gevonden
                            <span v-if="antwoordenGevondenDoor[groepIndex]">
                                [{{ getSpeler(antwoordenGevondenDoor[groepIndex]).naam }}]
                            </span>
                        </b-button>
                        <div
                            v-for="(woord, woordIndex) in groep.woorden"
                            :key="'groep_'+groepIndex+'_woord_'+woordIndex"
                            style="font-style: italic;"
                        >
                            {{ woord }}
                        </div>
                    </b-col>
                </b-row>

                
            </div>

            <div v-if="vraagKlaar" class="mt-4">
                <b-button variant="primary" @click="$emit('rondeKlaar')" v-if="alleSpelersGeweest">
                    <font-awesome-icon :icon="['fas', 'arrow-right']" size="lg" class="mr-2" /> 
                    Ronde 4
                </b-button>
                <b-button variant="info" @click="volgendeVraag()" class="mt-4" v-else>
                    <font-awesome-icon :icon="['fas', 'arrow-right']" size="lg" class="mr-2" /> 
                    Volgende onderwerp
                </b-button>
            </div>
        </div>
        
    </div>
</template>

<script>
import WoordenTable from "../../components/ronde3/WoordenTable";
import TimerToggle from "../TimerToggle";
import { mapGetters, mapState, mapActions } from "vuex"

export default {
    components: {
        TimerToggle,
        WoordenTable
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
            puzzelGestartDoor: {},

            puzzelData: null,
            gevondenGroepen: {}
        }
    },
    computed: {
       ...mapGetters('spelers', ['actieveSpeler', 'volgendeSpeler', 'getSpeler', 'timerLoopt']),
       ...mapState('spelers', ['spelers']),
        vragen() {
            return this.speldata.vragen
        },
        currentVraag() {
            return this.currentVraagObj.groepen; 
        },
        currentIntroductie() {
            return this.currentVraagObj.introductie;
        },
        currentVraagGestartDoor() {
            return this.puzzelGestartDoor[this.currentVraagIndex];
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
            var spelersGeweest = Object.values(this.puzzelGestartDoor)
            
            return !this.spelers.some(speler => {
                // Komt de speler voor in de lijst met spelers die al aan de beurt is geweest?
                var spelerIsGeweest = spelersGeweest.some(spelerId => spelerId == speler.spelerId)
                return !spelerIsGeweest
            });
        },
        allesGevonden(){
            return this.currentVraag.every((groep, groepIndex) => this.gevondenGroepen[groepIndex] == true)
        }
    },
    methods: {
        ...mapActions('spelers', ['stopTimer', 'startTimer']),
        createPuzzel() {
            let puzzelData = [];
            let gevondenGroepen = {};

            this.currentVraag.forEach(({sleutelwoord, woorden}, groepIndex) => {
                woorden.forEach(woord => {
                    puzzelData.push({woord, sleutelwoord, groepIndex})
                });
                gevondenGroepen[groepIndex] = false;
            });

            // Shuffle de woorden
            for (let i = puzzelData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [puzzelData[i], puzzelData[j]] = [puzzelData[j], puzzelData[i]];
            }

            this.$set(this, 'puzzelData', puzzelData);
            this.$set(this, 'gevondenGroepen', gevondenGroepen);
        },
        startVraag(){
            if(this.currentVraagIndex === null){
                this.currentVraagIndex = 0;
                // TODO: kies speler met minste tijd
            }
            else{
                this.currentVraagIndex++;
            }
            this.createPuzzel();
            this.$set(this.puzzelGestartDoor, this.currentVraagIndex, parseInt(this.actieveSpeler.spelerId));
            this.vraagKlaar = false;
        },
        volgendeVraag() {
            this.currentVraagIndex++;
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
        setGevonden(groep, groepIndex){
            this.antwoordenGevondenDoor[groepIndex] = this.actieveSpeler.spelerId;
            this.gevondenGroepen[groepIndex] = true;
            
            this.$store.dispatch('spelers/geefPuntenHuidigeSpeler', 30);

            if(this.allesGevonden){
                // Stop de timer
                // this.timerLoopt = false;
                this.stopTimer()
                this.vraagKlaar = true;

            }
        }
    },
    created(){
        // TODO speler kiezen met minste tijd
        this.startVraag()
    }
}
</script>

<style>

</style>
