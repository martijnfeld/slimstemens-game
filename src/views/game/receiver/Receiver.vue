<template>
  <div>
    <pre>{{ messages.join("\n") }}</pre>
  </div>
</template>

<script>
export default {
  data(){
    return {
      messages: [],
      lastConnectionIdx: 0,
      messsageIdx: 0
    }
  },
  methods: {
    addMessage(message){
      this.messages.push(message);
    },
    addConnection(connection) {
      let connectionIdx = ++this.lastConnectionIdx;
      connection.connectionId = connectionIdx;
      this.addMessage('New connection #' + connectionIdx);

      connection.addEventListener('message', (event) =>  {
        let messageIdx = this.messsageIdx++;
        const data = JSON.parse(event.data);
        const logString = 'Message ' + messageIdx + ' from connection #' +
          connection.connectionId + ': ' + data.message;
        this.addMessage(logString, data.lang);
        // maybeSetFruit(data.message);
        connection.send('Received message ' + messageIdx);
      });

      connection.addEventListener('close', (event) =>  {
        this.addMessage('Connection #' + connection.connectionId + ' closed, reason = ' +
          event.reason + ', message = ' + event.message);
      });
    }
  },
  created(){
    navigator.presentation.receiver.connectionList.then((list) => {
      list.connections.map((connection) => {
        this.addConnection(connection);
      });
      list.onconnectionavailable = (evt) => {
        this.addConnection(evt.connection);
      };
    });
  }
}
</script>

<style>

</style>
