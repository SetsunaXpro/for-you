import { gsap } from "gsap";

const pages = {
  home: document.getElementById("page-home"),
  story: document.getElementById("page-story"),
  scrapbook: document.getElementById("page-scrapbook"),
  final: document.getElementById("page-final"),
};

function showPage(key) {
  Object.entries(pages).forEach(([k, el]) => {
    if (k === key) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

// HOME
document.getElementById("btn-home-yes").addEventListener("click", () => {
  showPage("story");
});

// MUSIC
const musicEl = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

 // Ensure the audio element uses the provided <source> and expose a usable src
 // (some browsers set the source element but not audio.src directly)
 const sourceEl = musicEl.querySelector("source");
 if (sourceEl && sourceEl.src) {
   // assign the resolved full URL to the audio element so .play() checks work
   musicEl.src = sourceEl.src;
 }

 let musicOn = false;
 musicToggle.addEventListener("click", () => {
   musicOn = !musicOn;
   musicToggle.classList.toggle("active", musicOn);
   if (musicOn && (musicEl.src || (sourceEl && sourceEl.src))) {
     musicEl.play().catch(() => {});
   } else {
     musicEl.pause();
   }
 });

// STORY GAME
const scenes = Array.from(
  document.querySelectorAll(".story-scene-container .scene")
);
const dots = Array.from(document.querySelectorAll(".scene-dot"));
const dialogueBox = document.getElementById("story-dialogue").querySelector(
  ".dialogue-text"
);
const btnPrev = document.getElementById("btn-story-prev");
const btnNext = document.getElementById("btn-story-next");
const giftModal = document.getElementById("gift-modal");
const btnGiftContinue = document.getElementById("btn-gift-continue");

let currentScene = 0;
let giftFound = false;

// simple fun dialogue per item
const dialogueMap = {
  pillow: "salah, cuma ada guling… coba cari lagi ",
  desk: "cuma ketemu 10 dosa besar suharto & 19 juta lapangan pekerjaan ",
  plant: "kata si tanaman sih gaada disini ",
  "flower-left": "bunga nya layu kalo kamu gk nemenin aku.",
  "flower-right": "yg ini senyum kalo ngeliat kita bareng :3",
  "butterfly-1":
    "kata si kupu-kupu: mungkin bintang-bintang tau dimana…",
  "butterfly-2": "kupu-kupu yang ini bilang: coba pergi ke tempat dimana langit indigo malam menemani kilauan langit ",
  "star-1": "bintang yang ini kayak kamu: bright n dramatic.",
  "star-2": "bintangnya bilang: harta karun nya ada di depan…",
  "star-3": "yeu kocak yg ini malah kabur.",
  "star-4": "semuanya menunjuk ke arah yang spesial…",
  chest: "…bentar, yg ini kok mencurigakan ya.",
  pile: "acak-acakan, maklum ya kamar cowok berantakan heheee..",
  bow: "pita nya imut lucu sih kayak kamu, tapi kok ada yg kurang ya… kayak butuh hadiah.",
};

function updateScene(newIndex) {
  if (newIndex < 0 || newIndex >= scenes.length) return;
  scenes[currentScene].classList.remove("scene-active");
  scenes[newIndex].classList.add("scene-active");
  currentScene = newIndex;

  dots.forEach((d, i) => d.classList.toggle("active", i === currentScene));

  btnPrev.disabled = currentScene === 0;
  btnNext.disabled = currentScene === scenes.length - 1;
  dialogueBox.textContent = "";
}

btnPrev.addEventListener("click", () => {
  updateScene(currentScene - 1);
});

btnNext.addEventListener("click", () => {
  updateScene(currentScene + 1);
});

// click handlers for items
document
  .querySelector(".story-scene-container")
  .addEventListener("click", (e) => {
    const target = e.target.closest(".clickable");
    if (!target) return;
    const key = target.dataset.item;
    if (!key) return;

    if (key === "chest" && !giftFound) {
      giftFound = true;
      dialogueBox.textContent = "coba deh buka. EH, KEKNYA BENER INI ";
      gsap.fromTo(
        target,
        { scale: 1 },
        { scale: 1.08, duration: 0.2, yoyo: true, repeat: 3 }
      );
      setTimeout(() => {
        giftModal.classList.add("show");
      }, 650);
      return;
    }

    const text =
      dialogueMap[key] ||
      "hmm, gaada jugak… but i still found u, jadinya worth it.";
    dialogueBox.textContent = text;

    gsap.fromTo(
      target,
      { scale: 1 },
      { scale: 1.05, duration: 0.18, yoyo: true, repeat: 1 }
    );
  });

btnGiftContinue.addEventListener("click", () => {
  giftModal.classList.remove("show");
  showPage("scrapbook");
});

// SCRAPBOOK: flip animation & image uploads
const flipButton = document.getElementById("btn-scrapbook-flip");
const scrapbookBook = document.querySelector(".scrapbook-book");
const frontPage = document.querySelector(".scrapbook-page-front");
const backPage = document.querySelector(".scrapbook-page-back");
let flipped = false;

flipButton.addEventListener("click", () => {
  flipped = !flipped;
  if (flipped) {
    frontPage.classList.remove("scrapbook-page-active");
    backPage.classList.add("scrapbook-page-active");
  } else {
    backPage.classList.remove("scrapbook-page-active");
    frontPage.classList.add("scrapbook-page-active");
  }
  gsap.fromTo(
    scrapbookBook,
    { rotationY: flipped ? -10 : 10 },
    { rotationY: 0, duration: 0.35, ease: "power2.out" }
  );
});

// photo inputs
document.querySelectorAll(".photo-input").forEach((input) => {
  const wrapper = input.closest(".polaroid-photo");
  const img = wrapper.querySelector(".photo-img");
  const placeholder = wrapper.querySelector(".photo-placeholder");

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    img.src = url;
    img.style.display = "block";
    placeholder.style.display = "none";
  });
});

// scrapbook next → final page
document
  .getElementById("btn-scrapbook-next")
  .addEventListener("click", () => showPage("final"));

// small enter animation on load
window.addEventListener("load", () => {
  gsap.fromTo(
    pages.home.querySelector(".card-home"),
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
  );
});