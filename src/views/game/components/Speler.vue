<template>
    <div :class="{'speler': true, 'speler-actief': actief}">
        <div class="speler-naam">{{ speler.naam }}</div>
        <div class="speler-tijd">{{ speler.tijd }}</div>
    </div>
</template>

<script>
export default {
    props: {
        spelerId: {
            type: Number,
            required: true
        },
    },
    computed: {
        speler(){
            return this.$store.getters['spelers/getSpeler'](this.spelerId)
        },
        actief(){
            return this.$store.getters['spelers/isActieveSpeler'](this.spelerId)
        }
    }
}
</script>

<style>
.speler {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    border: 3px solid yellow;
    display: flex;

    font-size: 1.2rem;
    
    flex-direction: column;
    align-items: center;

    background-color: transparent;
    transition: background-color 0.3s;
}
.speler.speler-actief {
    background-color: orange;
}
.speler-naam{
    margin-top: auto;
    font-size: 0.9em;

}
.speler-tijd{
    font-size: 1.2em;
    margin-bottom: auto;
    padding-bottom: 5px;
}
</style>
