import { ref, nextTick } from "vue";

type Theme = "light" | "dark";

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return "light";
}

export function useTheme() {
  const theme = ref<Theme>(readTheme());

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme.value === "light" ? "dark" : "light";
    applyTheme(newTheme);
    nextTick(() => {
      theme.value = newTheme;
    });
  };

  return {
    theme,
    toggleTheme,
  };
}
