import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById("datetime-picker");
const startBtn = document.getElementById("start-btn");

const daysSpan = document.getElementById("days-span");
const hoursSpan = document.getElementById("hours-span");
const minutesSpan = document.getElementById("minutes-span");
const secondsSpan = document.getElementById("seconds-span");

const flatpickrOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: validateDate,
};

let userSelectedDate = null;

function validateDate(selectedDates) {
  userSelectedDate = selectedDates[0];

  if (userSelectedDate) {
    const isDataValid = new Date() < userSelectedDate;
    startBtn.disabled = !isDataValid;

    if (!isDataValid) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
        iconUrl: "/close-message.svg",
        theme: "dark",
        color: "#fff",
        backgroundColor: "#EF4040",
        messageColor: "#fff",
        titleColor: "#fff",
        iconColor: "#fff",
      });
    }
  }
}

flatpickr(datetimePicker, flatpickrOptions);

let timerIntervalId = null;

startBtn.addEventListener("click", startTimer);

function startTimer() {
  if (timerIntervalId) stopTimer();
  console.log(timerIntervalId);
  startBtn.disabled = true;

  const timeLeftFloor = userSelectedDate - new Date();
  let timeLeft = Math.floor(timeLeftFloor / 1000) * 1000;

  if (timeLeft < 0) return;
  setSpans(timeLeft);

  const interval = 1000;
  timerIntervalId = setInterval(() => {
    timeLeft -= interval;
    setSpans(timeLeft);
    console.log(timeLeft);
    if (timeLeft === 0) {
      stopTimer();
      return;
    }
  }, interval);

  function stopTimer() {
    clearInterval(timerIntervalId);
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function setSpans(timeLeft) {
  const { days, hours, minutes, seconds } = convertMs(timeLeft);
  daysSpan.textContent = addZeroIfNeeded(days);
  hoursSpan.textContent = addZeroIfNeeded(hours);
  minutesSpan.textContent = addZeroIfNeeded(minutes);
  secondsSpan.textContent = addZeroIfNeeded(seconds);
}

function addZeroIfNeeded(number) {
  return (number < 10 ? "0" : "") + String(number);
}
