"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

// page
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    title: document.querySelector(".header__title"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__bar-cover"),
  },
  content: document.querySelector(".main-inner"),
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
  if (!activeHabbit) {
    return;
  }
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      // Создание
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", habbit.id);
      element.classList.add("menu__item", "button-item");
      element.addEventListener("click", () => rerender(habbit.id));
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
  if (!activeHabbit) {
    return;
  }
  page.header.title.innerHTML = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`;
  page.header.progressPercent.innerHTML = `${progress.toFixed(0)}%`;
}

function rerenderDays(activeHabbit) {
  if (!activeHabbit) {
    return;
  }

  for (let [day, comment] of activeHabbit.days.entries()) {
    const existed = document.querySelector(`[comment-id="${day}"]`);
    /* if (existed) {
      page.content.innerHTML = "";
    } */
    if (!existed) {
      // Создание
      const habbit = document.createElement("div");
      habbit.setAttribute("comment-id", day);
      habbit.classList.add("habbit");
      page.content.append(habbit);

      const habbitDay = document.createElement("div");
      habbitDay.classList.add("habbit__day");
      habbitDay.innerHTML = `День ${day + 1}`;

      const habbitComment = document.createElement("div");
      habbitComment.classList.add("habbit__comment");
      habbitComment.innerHTML = `${comment.comment}`;

      habbit.append(habbitDay);
      habbit.append(habbitComment);

      const buttonDelete = document.createElement("button");
      buttonDelete.classList.add("habbit__delete");
      buttonDelete.innerHTML = `<img src="./assets/icons/delete.svg" alt="Удалить день ${
        day + 1
      }" class="habbit__delete-habbit">`;
      habbit.append(buttonDelete);
    }
  }

  const commentExisted = document.querySelector(".habbit-add");
  if (commentExisted) {
    return;
  }
  const addComment = document.createElement("div");
  addComment.classList.add("habbit", "habbit-add");
  addComment.innerHTML = `
      <div class="habbit__day">День ${activeHabbit.days.length + 1}</div>
      <form class="habbit__form">
          <input class="habbit__input-icon input" type="text" placeholder="Комментарий">
          <img class="habbit__image-comment" src="./assets/icons/comment.svg" alt="Иконка комментария">
          <button class="habbit__button-add">Готово</button>
      </form>
  `;
  document.querySelector(".main").append(addComment);
}

function rerender(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  rerenderHeader(activeHabbit);
  rerenderDays(activeHabbit);
  rerenderMenu(activeHabbit);
}

// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
