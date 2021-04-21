<template>
  <div id="app">
    <v-btn @click="offclicked" outlined color="success">
          Off
     </v-btn>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Default-site',
  data(){
    return {
        backendURL: '192.168.0.11:33333',

    },
     mounted() {
        // called when site is first visited/refreshed

     },
     methods: {
        offclicked: function() {
            axios.get(this.backendURL + 'off/').then(response => {
               console.log(response.data);
            });
        }
     }
  }
}
</script>
