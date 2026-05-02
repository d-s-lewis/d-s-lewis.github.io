const headings = document.querySelectorAll("h2");

function checkHeading(el) {
  const rect = el.getBoundingClientRect();

  const center = window.innerHeight / 2;
  const zoneTop = center - 50;
  const zoneBottom = center + 50;

  const overlaps = rect.bottom >= zoneTop && rect.top <= zoneBottom;

  if (overlaps) {
    el.classList.add("fill");
    observer.unobserve(el);
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        checkHeading(entry.target);
      }
    });
  },
  {
    rootMargin: "200px 0px 200px 0px",
    threshold: 0,
  }
);

headings.forEach((h) => observer.observe(h));

window.addEventListener(
  "scroll",
  () => {
    headings.forEach(checkHeading);
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  headings.forEach(checkHeading);
});

const darkModeBtn = document.querySelector(".dark-mode");
if (darkModeBtn) {
  darkModeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark);
  });
}
if (isDark) {
  document.documentElement.classList.add("dark");
}

(() => {
  const zone = document.getElementById("seaZone");
  const tank = document.getElementById("tank");
  const fish = document.getElementById("fish");
  const waves = document.querySelector(".waves");

  if (!zone) return;

  let fishX = 200;
  let fishY = 100;

  let targetX = 200;
  let targetY = 100;

  let angle = 0;

  let active = false;
  let fleeing = false;
  let hoverTimer = null;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function handleEnter(e) {
    if (zone.contains(e.relatedTarget) || waves.contains(e.relatedTarget))
      return;

    clearTimeout(hoverTimer);

    fleeing = false;
    active = false;

    hoverTimer = setTimeout(() => {
      active = true;
      fish.style.opacity = ".6";
    }, 3500);
  }

  zone.addEventListener("mouseenter", handleEnter);
  waves.addEventListener("mouseenter", handleEnter);

  zone.addEventListener("mouseleave", (e) => {
    if (waves.contains(e.relatedTarget)) return;

    clearTimeout(hoverTimer);

    if (active) {
      fleeing = true;
    }

    active = false;
  });

  waves.addEventListener("mouseleave", (e) => {
    if (zone.contains(e.relatedTarget)) return;

    clearTimeout(hoverTimer);

    if (active) {
      fleeing = true;
    }

    active = false;
  });

  function handleMove(e) {
    const rect = tank.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    targetX = clamp(x, 40, rect.width - 40);
    targetY = clamp(y, 30, rect.height - 30);
  }

  document.addEventListener("mousemove", handleMove);

  function animate() {
    if (active || fleeing) {
      if (fleeing) {
        const zoneCenterX = window.innerWidth / 2;
        const dir = fishX < zoneCenterX ? -1 : 1;

        targetY = fishY - 400;
        targetX = fishX + dir * 250;

        const escaped =
          fishY < -150 || fishX < -150 || fishX > window.innerWidth + 150;

        if (escaped) {
          active = false;
          fleeing = false;

          fish.style.opacity = "0";

          fishX = 200;
          fishY = 100;

          requestAnimationFrame(animate);
          return;
        }
      }

      fishX += (targetX - fishX) * 0.035;
      fishY += (targetY - fishY) * 0.035;

      const dx = targetX - fishX;
      const dy = targetY - fishY;

      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 0.1) {
        angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      }

      const maxSpeed = 25;
      const t = Math.min(speed / maxSpeed, 1);
      const wiggleAmp = t * 3;

      const time = performance.now() * 0.01;
      const wiggle = Math.sin(time) * wiggleAmp;

      fish.style.transform = `
        translate(${fishX}px, ${fishY}px)
        translate(-50%, -50%)
        rotate(${angle + wiggle}deg)
      `;
    }

    requestAnimationFrame(animate);
  }

  animate();
})();

const buttons = document.getElementsByClassName("reading-mode");
const stories = document.getElementsByClassName("written");
const reader = document.getElementById("reader");
[...buttons].forEach((b) => {
  b.addEventListener("click", (e) => {
    openReadingMode(e);
  });
});
const openReadingMode = (e) => {
  reader.classList.toggle("open");
  document.body.classList.add("reading");
  reader.querySelector("#words").innerHTML =
    e.currentTarget.parentElement.innerHTML;
  const toRemove = reader.querySelectorAll(".remove");
  toRemove.forEach((e) => e.remove());
  reader.querySelector("h2").classList.add("wordy");
  const closeReader = () => {
    reader.classList.remove("open");
    document.body.classList.remove("reading");
    [...stories].forEach((s) => {
      s.classList.remove("revealed");
    });
  };
  reader.querySelector("#words").addEventListener("click", (e) => {
    e.stopPropagation();
  });
  reader.querySelector("#close").addEventListener("click", () => closeReader());
  reader
    .querySelector("#overlay")
    .addEventListener("click", () => closeReader());
};
[...stories].forEach((s) => {
  s.addEventListener("click", () => {
    s.classList.add("revealed");
  });
});
