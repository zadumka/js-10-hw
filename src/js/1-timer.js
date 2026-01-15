import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
  datetime: document.querySelector("#datetime-picker"),
  btn: document.querySelector('.timer-btn'),
  daysField: document.querySelector('.field:nth-child(1) .value'),
  hoursField: document.querySelector('.field:nth-child(2) .value'),
  minutesField: document.querySelector('.field:nth-child(3) .value'),
  secondsField: document.querySelector('.field:last-child .value')
}

document.addEventListener('DOMContentLoaded', e => {
  refs.btn.classList.add('inactive');
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      refs.btn.classList.add('inactive');
      refs.btn.disabled = true;           
      iziToast.error({message: "Please choose a date in the future", position:`topRight` });
    } else {
      refs.btn.classList.remove('inactive');
      refs.btn.disabled = false;
    }
  },
};


const picker = flatpickr(refs.datetime, options);

  const timer = {
    isActive: false,
    intervalID:null,
    start() {
      if (this.isActive) return;
      this.isActive = true;
      refs.datetime.disabled = true;
      refs.btn.classList.add('inactive');
      this.intervalID = setInterval(() => {
      const endDate = picker.selectedDates[0];
      const date = new Date();
      const diff = endDate - date;
      convertMs(diff);
      addLeadingZero()
      if (diff < 1000) {
        clearInterval(this.intervalID);
        this.isActive = false;
        refs.datetime.disabled = false;
        refs.btn.classList.remove('inactive');
      } 
    
    }, 1000)
    },

}



refs.btn.addEventListener('click', () => {
  timer.start();
})

function convertMs(ms) {

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;


  const days = Math.floor(ms / day);
  refs.daysField.textContent = days;
  const hours = Math.floor((ms % day) / hour);
  refs.hoursField.textContent = hours;
  const minutes = Math.floor(((ms % day) % hour) / minute);
  refs.minutesField.textContent = minutes;
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  refs.secondsField.textContent = seconds;
  return { days, hours, minutes, seconds };
}

function addLeadingZero() {
  refs.daysField.textContent = refs.daysField.textContent.padStart(2, '0');
  refs.hoursField.textContent = refs.hoursField.textContent.padStart(2, '0');
  refs.minutesField.textContent = refs.minutesField.textContent.padStart(2, '0');
  refs.secondsField.textContent = refs.secondsField.textContent.padStart(2, '0');
}
