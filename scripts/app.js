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
  popup: document.querySelector(".cover"),
  inputIcon: document.querySelector('.popup__form input[name="icon"]'),
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

function togglePopup() {
  page.popup.classList.toggle("cover-hidden");
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
    habbit.classList.add("habbit");
    habbit.innerHTML = ` <div class="habbit__day">День ${
      Number(index) + 1
    }</div>
      <div class="habbit__comment" comment-id="${index}">${
      activeHabbit.days[index].comment
    }</div>
      <button class="habbit__delete" onclick="deleteDays(${Number(
        activeHabbit.id - 1
      )}, ${Number(index)})">
          <img src="./assets/icons/delete.svg" alt="Удалить день ${
            Number(index) + 1
          }" class="habbit__delete-habbit">
      </button>`;
    page.content.daysContainer.append(habbit);
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = "";
  }
}

// working with form
// получает все значения формы и немного валидирует
// но валидацию лучше добавлять отдельно
function getFormData(form, fields) {
  const formData = new FormData(form); // получает данные формы
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove("input--error");
    if (!fieldValue) {
      form[field].classList.add("input--error");
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}

// work with days
function addDays(event) {
  event.preventDefault();
  const data = getFormData(event.target, ["comment"]);
  if (!data) {
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });

  resetForm(event.target, ["comment"]);
  rerender(globalActiveHabbitId);
  saveData();
}

function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;

  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  document.location.replace(document.location.pathname + "#" + activeHabbitId); // хеши, чтобы оставаться на странице
  rerenderHeader(activeHabbit);
  rerenderDays(activeHabbit);
  rerenderMenu(activeHabbit);
}

function deleteDays(activeHabbitId, commentId) {
  for (let i = 0; i < habbits[activeHabbitId].days.length; i++) {
    if (
      habbits[activeHabbitId].days[i].comment ===
      document.querySelector(`[comment-id="${commentId}"]`).innerHTML
    ) {
      habbits[activeHabbitId].days.splice(i, 1);
    }
  }
  // можно написать через map
  // habbits = habbits.map((habbit) => {
  //   if (habbit.id === globalActiveHabbitId) {
  //     habbit.days.splice(commentId, 1);
  //     return {
  //       ...habbit,
  //       days: habbit.days,
  //     };
  //   }
  //   return habbit;
  // });
  rerender(globalActiveHabbitId);
  saveData();
}

// working with habbits

function setIcon(context, icon) {
  page.inputIcon.value = icon;
  const activeIcon = document.querySelector(".icon.icon-select--active");
  activeIcon.classList.remove("icon-select--active");
  context.classList.add("icon-select--active");
}

function addHabbits(event) {
  event.preventDefault();
  const data = getFormData(event.target, ["name", "icon", "target"]);
  if (!data) {
    return;
  }
  console.log(data);
  habbits.push({
    id: habbits.length + 1,
    icon: data.icon,
    name: data.name,
    target: data.target,
    days: [],
  });
  resetForm(event.target, ["name", "target"]);
  togglePopup();
  rerender(globalActiveHabbitId);
  saveData();
}

// init
(() => {
  loadData();
  const hashId = Number(document.location.hash.replace("#", ""));
  const urlHabbit = habbits.find((habbit) => habbit.id == hashId);
  if (urlHabbit) {
    rerender(urlHabbit.id);
  } else {
    rerender(habbits[0].id);
  }
})();
