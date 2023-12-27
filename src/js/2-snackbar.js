import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
const form = document.getElementById("form");

const delayInput = form.elements.delay;
const stateInput = form.elements.state;

form.addEventListener("submit", runPromise);

function runPromise(evt) {
  evt.preventDefault();

  const delay = delayInput.value;
  const state = stateInput.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") resolve(`Fulfilled promise in ${delay}ms`);
      else reject(`Rejected promise in ${delay}ms`);
    }, delay);
  });

  form.reset();

  promise
    .then(res => {
      iziToast.success({
        title: "Success",
        message: res,
        position: "topRight",
        iconUrl: "/success.svg",
        theme: "dark",
        color: "#fff",
        backgroundColor: "#59A10D",
        messageColor: "#fff",
        titleColor: "#fff",
        iconColor: "#fff",
      });
    })
    .catch(err => {
      iziToast.error({
        title: "Error",
        message: err,
        position: "topRight",
        iconUrl: "/close-message.svg",
        theme: "dark",
        color: "#fff",
        backgroundColor: "#EF4040",
        messageColor: "#fff",
        titleColor: "#fff",
        iconColor: "#fff",
      });
    });
}
