const daysContainer = document.querySelector(".days");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close");
const modalDate = document.getElementById("modal-date");
const noteInput = document.getElementById("note-text");
const saveBtn = document.querySelector(".save");
const moods = document.querySelectorAll(".mood");

const monthLabel = document.getElementById("month-label");
const prevBtn = document.querySelector(".month-btn.prev");
const nextBtn = document.querySelector(".month-btn.next");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let currentMonth = 0; // January
let currentYear = 2026;

let selectedDay = null;
let selectedDateKey = null;
let selectedMood = null;

/* =========================
   CALENDAR GENERATION!!!generates months and the corresponding dates and the thing rearraanges itself
   ========================= */

function generateCalendar(month, year) {
  daysContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // empty slots
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    daysContainer.appendChild(empty);
  }

  // actual days-generate
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = day;

    const key = `mood-${year}-${month}-${day}`;
    const saved = JSON.parse(localStorage.getItem(key));

    //note thingy
    if (saved?.note) dayEl.classList.add("has-note");
    if (saved?.mood) dayEl.classList.add(saved.mood);

    // today highlight- circle thingy around current date
    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayEl.classList.add("today");
    }

    dayEl.addEventListener("click", () => openModal(day, key));
    daysContainer.appendChild(dayEl);
  }

  monthLabel.textContent = `${months[month]} ${year}`;
}

/* =========================
   MODAL LOGIC!!!
   ========================= */

function openModal(day, key) {
  selectedDateKey = key;
  modalDate.textContent = `${months[currentMonth]} ${day}, ${currentYear}`;

  const saved = JSON.parse(localStorage.getItem(key));
  noteInput.value = saved?.note || "";
  selectedMood = saved?.mood || null;

  moods.forEach(m => m.classList.remove("selected"));
  if (selectedMood) {
    document.querySelector(`.mood[data-mood="${selectedMood}"]`)
      ?.classList.add("selected");
  }

  modal.classList.remove("hidden");
}

closeBtn.onclick = () => modal.classList.add("hidden");
modal.onclick = e => e.target === modal && modal.classList.add("hidden");

/* =========================
   MOOD PICKER
   ========================= */

moods.forEach(mood => {
  mood.addEventListener("click", () => {
    moods.forEach(m => m.classList.remove("selected"));
    mood.classList.add("selected");
    selectedMood = mood.dataset.mood;
  });
});

/* =========================
   SAVE LOGIC
   ========================= */

saveBtn.addEventListener("click", () => {
  const note = noteInput.value.trim();

  if (!note && !selectedMood) {
    localStorage.removeItem(selectedDateKey);
  } else {
    localStorage.setItem(
      selectedDateKey,
      JSON.stringify({ note, mood: selectedMood })
    );
  }

  modal.classList.add("hidden");
  generateCalendar(currentMonth, currentYear);
});

/* =========================
   MONTH NAVIGATION
   ========================= */

nextBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
};

prevBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
};

/* =========================
   INIT
   ========================= */

generateCalendar(currentMonth, currentYear);

