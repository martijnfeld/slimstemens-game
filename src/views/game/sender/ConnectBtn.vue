<template>
  
    <b-button @click="connectScreen()" :disabled="verbinden">
        Verbinden
    </b-button>

</template>

<script>
import { connect } from '@/services/presentation';
export default {
    data(){
        return {
            verbinden: false,
        }
    },
    methods: {
        connectScreen() {
            this.verbinden = true
            connect().finally(ok => {
                this.verbinden = false
            });
        }
    }
}
</script>

<style>

</style>
