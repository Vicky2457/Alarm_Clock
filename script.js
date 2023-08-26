// Variable to hold the timeout of a scheduled alarm
let scheduledAlarmTimeout;
// Function to update the digital clock display
const updateClock = () => {
  const now = new Date();
    // Get the current time
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const meridian = now.getHours() < 12 ? "AM" : "PM";
    // Update the clock display
  document.getElementById("digital-clock").innerText = `${hours}:${minutes}:${seconds} ${meridian}`;
};

// Function to set a new alarm
const setAlarm = () => {
  // Get the alarm time input from the user
  const alarmTimeInput = document.getElementById("alarm-time");
  const alarmTime = alarmTimeInput.value;

  // Parse and format the alarm time
  const [hours, minutes, seconds] = alarmTime.split(":");
  let hours12 = parseInt(hours) % 12 || 12;
  const meridian = parseInt(hours) >= 12 ? "PM" : "AM";
  const alarmTime12 = `${String(hours12).padStart(2, "0")}:${minutes}:${seconds} ${meridian}`;

    // Add the alarm to the alarms list
  const alarmsList = document.getElementById("alarms");
  const newAlarm = document.createElement("li");
  newAlarm.textContent = alarmTime12;
  alarmsList.appendChild(newAlarm);

  // Create a delete button for the alarm
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function() {
    deleteAlarm(newAlarm);
  };
  newAlarm.appendChild(deleteButton);
    // Clear the alarm time input
  alarmTimeInput.value = "";
    // Schedule the alarm
  scheduledAlarmTimeout = scheduleAlarm(alarmTime);
};
// Function to schedule an alarm
const scheduleAlarm = (alarmTime) => {
  const now = new Date();
  const [hours, minutes, seconds] = alarmTime.split(":");

  const alarmDateTime = new Date(now);
  let hours12 = parseInt(hours) % 12 || 12;
  const meridian = parseInt(hours) >= 12 ? "PM" : "AM";
  alarmDateTime.setHours(meridian === "AM" ? hours12 : hours12 + 12, parseInt(minutes), parseInt(seconds));
  if (alarmDateTime < now) {
    alarmDateTime.setDate(alarmDateTime.getDate() + 1);
  }
  const timeUntilAlarm = alarmDateTime - now;
  return setTimeout(() => {
    playAlarmTune();
  }, timeUntilAlarm);
};

// Function to delete an alarm
const deleteAlarm = (alarmElement) => {
  if (scheduledAlarmTimeout) {
    clearTimeout(scheduledAlarmTimeout);
  }

  // Remove the alarm element from the alarms list
  const alarmsList = document.getElementById("alarms");
  alarmsList.removeChild(alarmElement);
};

// Function to play the alarm sound and show a notification
const playAlarmTune = () => {
  const audio = document.getElementById("alarm-audio");     // Play the alarm sound
  audio.play();

  alert("Alarm! Time to wake up!");

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = `Alarm! Time to wake up!`;

  const notificationContainer = document.getElementById("notification-container");
  notificationContainer.appendChild(notification);

  setTimeout(() => {
    const ringingAlarm = document.querySelector(".ringing-alarm");
    notificationContainer.removeChild(notification);
  }, 10000); // Adjust the delay as needed (in milliseconds)
};

// Function to validate a time format
const validateTime = (time) => {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Function to show a notification
const showNotification = (message) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Alarm", { body: message });
  } else if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Alarm", { body: message });
      }
    });
  }
};

// Update the clock display every second
setInterval(updateClock, 1000);
