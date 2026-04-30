let isDark = JSON.parse(localStorage.getItem("darkMode")) ?? false;
if (isDark) {
  document.documentElement.classList.add("dark");
}
