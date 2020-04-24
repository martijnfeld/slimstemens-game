<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <button @click="connect()">connect</button>
    <button @click="start()" v-if="request" :disabled="!!availability">start</button>
    <button @click="stop()" v-if="presentatie">stop</button>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data(){
    return {
      request: undefined,
      availability: false,
      presentatie: undefined
    }
  },
  methods: {
    connect(){
      this.request = new PresentationRequest(["/receiver"]);
      
      this.request.getAvailability().then((availability) => {
      console.log(availability)
        // availability.value may be kept up-to-date by the controlling UA as long
        // as the availability object is alive. It is advised for the web developers
        // to discard the object as soon as it's not needed.
        // handleAvailabilityChange(availability.value);
          this.availability = availability.value
        availability.onchange = function() { 
          this.availability = availability.value
        };
      }).catch(function(err) {
        // Availability monitoring is not supported by the platform, so discovery of
        // presentation displays will happen only after request.start() is called.
        // Pretend the devices are available for simplicity; or, one could implement
        // a third state for the button.
        // handleAvailabilityChange(true);
        console.log(err)
      });
    },
    start(){
      this.request.start().then(a => {console.log(this.presentatie = a)});
    },
    stop(){
      this.presentatie.terminate()
    }
  }
}
</script>
