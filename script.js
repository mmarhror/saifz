const pages = document.querySelectorAll(".page");
let index = 0;
let isAnimating = false;

function showPage(i) {
  if (isAnimating) return;
  isAnimating = true;

  const currentPage = pages[index];
  const nextPage = pages[i];

  currentPage.classList.add("exiting");

  setTimeout(() => {
    currentPage.classList.remove("active", "exiting");
    nextPage.classList.add("active");
    index = i;

    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }, 300);
}

document.getElementById("next").onclick = () => {
  const nextIndex = (index + 1) % pages.length;
  showPage(nextIndex);
};

document.getElementById("prev").onclick = () => {
  const prevIndex = (index - 1 + pages.length) % pages.length;
  showPage(prevIndex);
};

/* KEYBOARD NAVIGATION */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") document.getElementById("next").click();
  if (e.key === "ArrowLeft") document.getElementById("prev").click();
});

/* SWIPE SUPPORT */
let startX = 0;
let startY = 0;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  let endY = e.changedTouches[0].clientY;

  let diffX = endX - startX;
  let diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 50) document.getElementById("prev").click();
    if (diffX < -50) document.getElementById("next").click();
  }
});

/* FLOATING HEARTS */
const heartContainer = document.querySelector(".floating-hearts");
const heartEmojis = ["💗", "💕", "💖", "💘", "❤️", "💝"];

function createHeart() {
  const heart = document.createElement("span");
  heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 5 + Math.random() * 5 + "s";
  heart.style.fontSize = 20 + Math.random() * 20 + "px";
  heartContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 10000);
}

setInterval(createHeart, 500);

for (let i = 0; i < 5; i++) {
  setTimeout(createHeart, i * 200);
}

/* CONFETTI ON LAST PAGE */
function createConfetti() {
  if (index !== pages.length - 1) return;

  const colors = ["#ff6b9d", "#ff8fb1", "#ffc2d1", "#fff", "#ffe5f0"];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        opacity: 1;
        transform: rotate(${Math.random() * 360}deg);
        transition: all 3s ease-out;
        pointer-events: none;
        z-index: 1000;
        border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
      `;

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = "100vh";
        confetti.style.opacity = "0";
        confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
      }, 10);

      setTimeout(() => confetti.remove(), 3000);
    }, i * 30);
  }
}

const observer = new MutationObserver(() => {
  if (index === pages.length - 1) {
    createConfetti();
  }
});

pages.forEach((page) => {
  observer.observe(page, { attributes: true, attributeFilter: ["class"] });
});
