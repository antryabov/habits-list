"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

// page
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    title: document.querySelector(".header__title"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__bar-cover"),
  },
  content: {
    daysContainer: document.querySelector(".main-inner"),
    nextDay: document.querySelector(".habbit__day"),
  },
};

// utils

function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);

  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

// render
function rerenderMenu(activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", habbit.id);
      element.classList.add("menu__item", "button-item");
      element.addEventListener("click", () => {
        page.content.innerHTML = "";
        rerender(habbit.id);
      });
      element.innerHTML = `<img src="./assets/icons/${habbit.icon}.svg" alt="${habbit.name}">`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add("button-item--active");
      }
      page.menu.append(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("button-item--active");
    } else {
      existed.classList.remove("button-item--active");
    }
  }
}

function rerenderHeader(activeHabbit) {
  page.header.title.innerHTML = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`;
  page.header.progressPercent.innerHTML = `${progress.toFixed(0)}%`;
}

function rerenderDays(activeHabbit) {
  page.content.daysContainer.innerHTML = "";
  for (let index in activeHabbit.days) {
    const habbit = document.createElement("div");
    habbit.setAttribute("comment-id", index);
    habbit.classList.add("habbit");
    habbit.innerHTML = ` <div class="habbit__day">День ${
      Number(index) + 1
    }</div>
      <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
      <button class="habbit__delete">
          <img src="./assets/icons/delete.svg" alt="Удалить день ${
            index + 1
          }" class="habbit__delete-habbit">
      </button>`;
    page.content.daysContainer.append(habbit);
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

// work with days
function addDays(event) {
  const form = event.target;
  event.preventDefault();

  const data = new FormData(form); // получает данные формы
  const comment = data.get("comment");
  form["comment"].classList.remove("input--error");
  if (!comment) {
    form["comment"].classList.add("input--error"); // по атрибуту name
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }]),
      };
    }
    return habbit;
  });

  form["comment"].value = "";
  rerender(globalActiveHabbitId);
  saveData();
}

function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;

  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  rerenderHeader(activeHabbit);
  rerenderDays(activeHabbit);
  rerenderMenu(activeHabbit);
}

// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
