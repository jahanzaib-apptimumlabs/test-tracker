
// import consumer from "./consumer";

// consumer.subscriptions.create('SessionChannel', {
//   connected() {
//     console.log('Connected to SessionChannel');
//     console.log('Connected');
//   },
//   disconnected() {
//     console.log('Disconnected from SessionChannel');
//   },
//   received(data) {
//     console.log(data);
//     const sessionId = data.id;
//     const checkIn = data.check_in;

//     console.log('Session ID:', sessionId);
//     console.log('Check-in:', checkIn);
//   }
// });