// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "channels"

import { createConsumer } from '@rails/actioncable'

const consumer = createConsumer();
let currentTime = new Date().toISOString();
let userSessionId;

let intervalId;

let timerType

const clearIntervalAndSetState = () => {
  clearInterval(intervalId);
};

const checkLockTime = (sessionId) => {

  const interval = setInterval(() => {
    console.log('This is session is:', sessionId);
    if (sessionId) {
      console.log('Call after 10 seconds!');
      currentTime = new Date().toISOString();
      if (timerType == 'work'){
        consumer.subscriptions.subscriptions[0].perform('update', { current_time: currentTime, session_id: sessionId, time_type: timerType, mouse_clicks: 10, keystrokes: 30, image_url: 'https://thumbs.dreamstime.com/b/software-testing-internet-business-technology-concept-143071525.jpg' })
      }else{
        consumer.subscriptions.subscriptions[0].perform('update', { current_time: currentTime, session_id: sessionId, time_type: timerType })
      }
    }
  }, 10000); // Send the request every 10 seconds

  // Start the interval and save the interval ID
  intervalId = interval;

  // Clear the interval when needed
  consumer.subscriptions.create('SessionChannel', {
    connected() {
      console.log('Connected to SessionChannel');
    },
    disconnected() {
      console.log('Disconnected from SessionChannel');
      clearIntervalAndSetState();
    },
    received(data) {
      console.log(data);
      userSessionId = data[0].id;
      let checkOutOption = data[0].checkout_time
      console.log("checkOutOption: ", checkOutOption);

      if (checkOutOption) {
        clearIntervalAndSetState();
        return;
      } else {
        console.log('userSessionId=>>>>>:', userSessionId)
        checkLockTime(userSessionId);
        checkOutOption = false;
      }
    },
  });
};

// const sessionChannel = consumer.subscriptions.create('SessionChannel', {
consumer.subscriptions.create('SessionChannel', {
  connected() {
    console.log('Connected to SessionChannel');
  },
  disconnected() {
    console.log('Disconnected from SessionChannel');
  },
  received(data) {
    console.log(data);
    userSessionId = data[0].id;
    let checkOutOption = data[0].checkout_time
    console.log("checkOutOption: ", checkOutOption);

    if (checkOutOption) {
      return;
    } else {
      // Start checking the lock time after receiving the session ID
      checkLockTime(userSessionId);
      checkOutOption = false
    }
  },
});


document.addEventListener('DOMContentLoaded', () => {
  const timeDisplay = document.getElementById('time-display');
  const breakTimeDisplay = document.getElementById('break-time-display');
  const meetingTimeDisplay = document.getElementById('meeting-time-display');
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');
  const checkinBtn = document.getElementById('checkin-btn');
  const checkoutBtn = document.getElementById('checkout-btn');
  const breakBtn = document.getElementById('break-btn');
  const meetingBtn = document.getElementById('meeting-btn');

  let intervalId;
  let breakIntervalId;
  let meetingIntervalId;
  let timeInMilliseconds = 0;

  function startTimer() {
    timerType="work"
    if (meetingIntervalId) {
      stopMeetingTimer();
    }
    if (breakIntervalId) {
      stopBreakTimer();
    }
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      timeInMilliseconds += 10;
      displayTime();
    }, 10);

    const currentTime = new Date().toString();
    consumer.subscriptions.subscriptions[0].perform('create', { checkin_time: currentTime })
  }

  function stopTimer() {
    clearInterval(intervalId);
  }

  function stopBreakTimer() {
    clearInterval(breakIntervalId);
  }
  function stopMeetingTimer() {
    clearInterval(meetingIntervalId);
  }

  function resetTimer() {
    clearInterval(intervalId);
    timeInMilliseconds = 0;
    displayTime();
  }

  function displayTime() {
    const hours = Math.floor(timeInMilliseconds / 3600000);
    const minutes = Math.floor((timeInMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
    const milliseconds = timeInMilliseconds % 1000;

    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZeroMilliseconds(milliseconds)}`;
    timeDisplay.textContent = formattedTime;
  }

  function padZero(number) {
    return number.toString().padStart(2, '0');
  }

  function padZeroMilliseconds(number) {
    return number.toString().padStart(3, '0');
  }

  // startBtn.addEventListener('click', () => {
  //   startTimer();
  // });

  checkinBtn.addEventListener('click', () => {
    startTimer();
  });

  // stopBtn.addEventListener('click', () => {
  //   stopTimer();
  // });

  // resetBtn.addEventListener('click', () => {
  //   resetTimer();
  // });

  checkoutBtn.addEventListener('click', function () {
    // Send an action to the SessionChannel to stop the session
    console.log('This is session_id:', userSessionId)
    stopTimer();
    stopBreakTimer();
    stopMeetingTimer();
    consumer.subscriptions.subscriptions[0].perform('stop', { session_id: userSessionId })
  });

  let timeInMiliSeconds = 0;
  const startBreakTimer = () => {
    timerType="break"
    breakIntervalId = setInterval(() => {
      const hours = Math.floor(timeInMiliSeconds / 3600000);
      const minutes = Math.floor((timeInMiliSeconds % 3600000) / 60000);
      const seconds = Math.floor((timeInMiliSeconds % 60000) / 1000);
      const milliseconds = timeInMiliSeconds % 1000;

      const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZeroMilliseconds(milliseconds)}`;
      breakTimeDisplay.textContent = formattedTime;
      // consumer.subscriptions.subscriptions[0].perform('update', { working_time: currentTime , session_id : userSessionId, time_type: 'break' })
      timeInMiliSeconds += 10;
    }, 10);

  }

  breakBtn.addEventListener('click', function () {
    if (meetingIntervalId) {
      stopMeetingTimer();
    }
    if (intervalId) {
      stopTimer()
    }
    startBreakTimer();
    stopTimer();
  });

  let timeInMiliSecond = 0;

  const startMeetingTimer = () => {
    timerType = "meeting"
    meetingIntervalId = setInterval(() => {
      const hours = Math.floor(timeInMiliSecond / 3600000);
      const minutes = Math.floor((timeInMiliSecond % 3600000) / 60000);
      const seconds = Math.floor((timeInMiliSecond % 60000) / 1000);
      const milliseconds = timeInMiliSecond % 1000;
      const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZeroMilliseconds(milliseconds)}`;
      meetingTimeDisplay.textContent = formattedTime;
      timeInMiliSecond += 10;
    }, 10);
  }
  let toggleMeetingButton = true;
  meetingBtn.addEventListener('click', function () {
    if (intervalId) {
      stopTimer();
    }
    if (breakIntervalId) {
      stopBreakTimer();
    }
    stopBreakTimer();
    if (toggleMeetingButton) {
      startMeetingTimer();
      meetingBtn.innerText = 'Stop Meeting';
    } else {
      stopMeetingTimer();
      meetingBtn.innerText = 'Start Meeting';
    }
    toggleMeetingButton = !toggleMeetingButton;
  });

});


