import { ref, onMounted } from "vue";

type Theme = "light" | "dark";

export function useTheme() {
  const theme = ref<Theme>("light");

  onMounted(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
      theme.value = savedTheme;
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      theme.value = prefersDark ? "dark" : "light";
    }

    applyTheme(theme.value);
  });

  const applyTheme = (newTheme: Theme) => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme.value === "light" ? "dark" : "light";
    theme.value = newTheme;
    applyTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
  };
}
