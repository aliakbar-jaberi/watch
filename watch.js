// let alarm = [];
const audio = new Audio("/assets/audio/Radar.mp3");
audio.loop = true;
let alarmActive = {};
// Selection
const btnSetting = document.querySelector("#setting");
const formAlarm = document.querySelector(".form--alarm");
const formBack = document.querySelector(".back");
const alarmInput = document.querySelector(".alarm__iput");
const alarmTitel = document.querySelector(".alarm__title");
const alarmList = document.querySelector(".alarm__list .alarm__table");
const formError = document.querySelector(".alarm__iputerror");
const body = document.querySelector("body");
const message = document.querySelector(".message");
const messageAlarm = document.querySelector(".alarm");
const alarmName = document.querySelector(".alarm__name");
const alarmTime = document.querySelector(".alarm__time");
const alarmBack = document.querySelector(".alarm__back");
const alarmRow = document.querySelector(".table__body");
const alarmSnooze = document.querySelector(".alarm__snooze");
const alarmIntermit = document.querySelector(".alarm__intermit");
const editAlarm = document.querySelector(".edit--alarm");
const editTitel = document.querySelector(".edit__title");
const editInput = document.querySelector(".edit__iput");
const editBtn = document.querySelector(".edit");

// event
btnSetting.addEventListener("click", openSetting);
formBack.addEventListener("click", close);
formAlarm.addEventListener("submit", addNewAlarm);
alarmBack.addEventListener("click", snooze);
alarmSnooze.addEventListener("click", snooze);
alarmIntermit.addEventListener("click", intermit);
document.addEventListener("DOMContentLoaded", (e) => {
  const alarm = getAllAlarms();
  createAlarme(alarm);
});

// function

function addNewAlarm(e) {
  e.preventDefault();
  if (!alarmInput.value) {
    formError.style.display = "block";
    alarmInput.style.border = "2px solid red";
    return;
  }

  formError.style.display = "none";
  alarmInput.style.border = "1px solid var(--primaryColor)";

  let timeInput = alarmInput.value;
  let timeParts = timeInput.split(":");
  let hours = parseInt(timeParts[0]);
  let minutes = parseInt(timeParts[1]);
  hours = ("0" + hours).slice(-2);
  minutes = ("0" + minutes).slice(-2);
  if (!alarmTitel.value) {
    alarmTitel.value = "Alarm";
  }
  const newAlarm = {
    titel: alarmTitel.value,
    h: hours,
    m: minutes,
    s: 0,
    id: Date.now(),
    active: true,
  };

  // alarm.push(newAlarm);
  saveAlarm(newAlarm);
  const alarm = getAllAlarms();
  createAlarme(alarm);
  close();
}
function openSetting() {
  formAlarm.style.transform = "  rotatey(0deg)";
  formBack.style.display = "block";
  formBack.style.opacity = "1";
}

function editAlarms(e) {
  let alarm = getAllAlarms();
  const alarmId = Number(e.target.dataset.todoId);
  const active = alarm.find((a) => a.id === alarmId);
  editTitel.value = active.titel;
  editInput.value = `${active.h}:${active.m}`;
  editAlarm.style.transform = "  rotatey(0deg)";
  formBack.style.display = "block";
  formBack.style.opacity = "1";
  editAlarm.addEventListener("submit", (e) => {
    e.preventDefault();
    active.titel = editTitel.value;
    let timeInput = editInput.value;
    let timeParts = timeInput.split(":");
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);
    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    active.h = hours;
    active.m = minutes;
    active.active = true;
    saveAllAlarem(alarm);
    createAlarme(alarm);
    close();
  });
}

function removeAlarms(e) {
  let alarm = getAllAlarms();
  const alarmId = Number(e.target.dataset.todoId);
  alarm = alarm.filter((t) => t.id !== alarmId);
  saveAllAlarem(alarm);
  createAlarme(alarm);
}
function close() {
  formAlarm.style.transform = "rotatey(-90deg)";
  editAlarm.style.transform = "  rotatey(-90deg)";
  formBack.style.display = "none";
  formBack.style.opacity = "0";
}

function createAlarme(alarms) {
  let result = "";

  alarms.forEach((alarm) => {
    result += `
    <tr class="table__body ${alarm.active ? " " : "inactive"}">
          <td class=" ${alarm.active ? " " : "inactive"}">${alarm.titel}</td>
          <td class=" ${alarm.active ? " " : "inactive"}">${alarm.h}:${
      alarm.m
    }</td>
          <td>
             <i class="alarm__edit fa-solid fa-pen-to-square" data-todo-id=${
               alarm.id
             } ></i>
            <i class="alarm__delete  fa-solid fa-trash" data-todo-id=${
              alarm.id
            }></i>
          </td>
        </tr>`;
  });

  alarmList.innerHTML = result;

  const btnEdit = [...document.querySelectorAll(".alarm__edit")];
  btnEdit.forEach((btn) => btn.addEventListener("click", editAlarms));
  const btnRemove = [...document.querySelectorAll(".alarm__delete")];
  btnRemove.forEach((btn) => btn.addEventListener("click", removeAlarms));
}

function currenWatch() {
  let alarm = getAllAlarms();
  let date = new Date();
  let hours = date.getHours();
  let min = date.getMinutes();
  let second = date.getSeconds();

  hours = hours < 10 ? "0" + hours : hours;
  min = min < 10 ? "0" + min : min;
  second = second < 10 ? "0" + second : second;
  let time = hours + ":" + min + ":" + second;
  alarm.forEach((e) => {
    if (e.h == hours && e.m == min && e.active && e.s == second) {
      audio.play();
      audio.loop = true;
      alarmName.innerText = e.titel;
      alarmTime.innerText = `${e.h}:${e.m}`;
      messageAlarm.style.display = "flex";
      alarmBack.style.display = "block";
      alarmBack.style.opacity = "1";
      alarmActive = e;
    }
  });
  document.querySelector(".watch").innerText = time;

  if (hours > 12) {
    message.innerText = "Good Afternoon";
    return;
  }

  if (hours <= 6 && hours >= 5) {
    body.style.backgroundImage = "url(/assets/img/Rise.svg)";
    message.innerText = "Good Morning";
    return;
  }
  if (hours < 19 && hours >= 17) {
    body.style.backgroundImage = "url(/assets/img/sunset.svg)";
    message.innerText = "Good Afternoon";
    return;
  }
  if (hours >= 19 || hours < 5) {
    body.style.backgroundImage = "url(/assets/img/night.svg)";
    message.innerText = "Good Night";
    return;
  } else {
    body.style.backgroundImage = "url(/assets/img/Day.svg))";
    message.innerText = "Good Morning";
    return;
  }
}

function snooze() {
  let alarm = getAllAlarms();
  const alarmId = alarmActive.id;
  const active = alarm.find((a) => a.id === alarmId);
  hours = parseInt(active.h);
  mins = parseInt(active.m);
  mins += 10;
  if (mins >= 60) {
    hours += 1;
    mins -= 60;
  }
  active.m = mins < 10 ? "0" + mins : mins;
  active.h = hours < 10 ? "0" + hours : hours;

  saveAllAlarem(alarm);

  if (alarmId) {
    messageAlarm.style.display = "none";
    alarmBack.style.display = "none";
    alarmBack.style.opacity = "0";
    audio.pause();
    createAlarme(alarm);
  }
}

function intermit() {
  let alarm = getAllAlarms();
  const alarmId = alarmActive.id;
  const active = alarm.find((a) => a.id === alarmId);
  active.active = !active.active;
  if (alarmId) {
    messageAlarm.style.display = "none";
    alarmBack.style.display = "none";
    alarmBack.style.opacity = "0";
    audio.pause();

    createAlarme(alarm);
  }
  saveAllAlarem(alarm);
}
currenWatch();
setInterval(currenWatch, 1000);
// localStorage

function getAllAlarms() {
  const savedAlarms = JSON.parse(localStorage.getItem("alarms")) || [];
  return savedAlarms;
}

function saveAlarm(alarms) {
  const savedAlarms = getAllAlarms();
  savedAlarms.push(alarms);
  localStorage.setItem("alarms", JSON.stringify(savedAlarms));
  return savedAlarms;
}

function saveAllAlarem(alarms) {
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
