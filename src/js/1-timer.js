import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let timerId = null;
const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const dayEl = document.querySelector('span[data-days]');
const hourEl = document.querySelector('span[data-hours]');
const minuteEl = document.querySelector('span[data-minutes]');
const secondEl = document.querySelector('span[data-seconds]');

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: '',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    startBtn.disabled = false;
    console.log(selectedDates[0]);
  },
};

flatpickr('#datetime-picker', options);

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  input.disabled = true;

  clearInterval(timerId);

  timerId = setInterval(() => {
    const nowTime = new Date();
    const differentTime = userSelectedDate - nowTime;

    if (differentTime <= 0) {
      clearInterval(timerId);
      updateTimerDisplay(0, 0, 0, 0);
      input.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(differentTime);

    upDateTimer(days, hours, minutes, seconds);
  }, 1000);
});

function upDateTimer(days, hours, minutes, seconds) {
  dayEl.textContent = days.toString().padStart(2, '0');
  hourEl.textContent = addLeadingZero(hours);
  minuteEl.textContent = addLeadingZero(minutes);
  secondEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
