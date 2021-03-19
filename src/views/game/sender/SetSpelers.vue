<template>
    <b-form>
        <b-form-group description="Let us know your name." label="Aantal spelers" label-for="input-1">
            <b-input type="number" step="1" v-model.number="numSpelers" min="2" max="100" />
        </b-form-group>
        <b-form-group v-for="spelerNr in numSpelers" :key="'s_'+spelerNr" :label="'Naam speler #'+spelerNr" label-for="input-1">
            <b-input type="text" v-model="spelers[spelerNr]" required />
        </b-form-group>
    </b-form>

</template>

<script>
export default {
    name: "SetSpelers",
    data() {
        return {
            numSpelers: 2,
            spelers: {
                1: 'Speler 1',
                2: 'Speler 2'
            },
        }
    },
    computed: {
        spelersComputed(){
            if(this.numSpelers >= 2){
                var spelers = [];
                for (var speler = 1; speler <= this.numSpelers; speler++) {
                    var spelerNaam = this.spelers[speler];
                    if(!!spelerNaam){
                        spelers.push(spelerNaam);
                    }
                    else{
                        console.log(spelerNaam)
                        return undefined;
                    }
                }
    
                return spelers;
            }
            return undefined;
        }
    },
    watch: {
        spelers: {
            deep: true,
            immediate:true,
            handler() {
                this.$emit('input', this.spelersComputed)
            }
        }
    },
    created(){
        var numSpelers = this.spelers ? this.spelers.length : 2;
        this.numSpelers = numSpelers > 2 ? numSpelers : 2;
    }
}
</script>

<style>

</style>
