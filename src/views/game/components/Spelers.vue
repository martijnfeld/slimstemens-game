<template>
    <div class="d-flex">
        <Speler 
            v-for="(speler, index) in spelers" 
            :key="'speler_'+index" 
            :speler-id="speler.spelerId" 
            class="mx-auto"
        />
    </div>
</template>

<script>
import Speler from "./Speler"
import { mapState } from 'vuex';

export default {
    name: "Spelers",
    components: { Speler },
    props: {
        activeSpeler: Number
    },
    computed: {
        ...mapState({
            spelers: state => state.spelers.spelers
        })
    }
}
</script>

<style>

</style>
