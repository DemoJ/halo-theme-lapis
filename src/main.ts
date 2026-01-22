import "./styles/main.css";
import "./styles/lapis/lapis.css";
import "./styles/lapis/lapis-dark.css";
import "virtual:uno.css";
import Alpine from "alpinejs";

window.Alpine = Alpine;

export function enableResizeImage() {
  if (window.location.pathname === "/moments") {
    return;
  }

  // Resize images automatically, set width to 80%, or 100% for small screens
  function resizeImage(): void {
    const images: NodeListOf<HTMLImageElement> = document.querySelectorAll(".write img");
    const screenWidth: number = window.innerWidth;

    images.forEach((img: HTMLImageElement) => {
      img.removeAttribute("width");
      img.removeAttribute("height");

      const aspectRatio: number = img.naturalHeight / img.naturalWidth;

      if (screenWidth > 768) {
        img.style.width = "80%";
        if (aspectRatio > 1.5) {
          img.style.width = "50%";
        }
      } else {
        img.style.width = "100%";
      }

      // Center the image
      (img.parentElement as HTMLParagraphElement).style.textAlign = "center";
    });
  }
  resizeImage();

  window.addEventListener("resize", resizeImage);
}

Alpine.data("prefersColorScheme", () => ({
  colorScheme: "light",
  colorSchemeQuery: window.matchMedia("(prefers-color-scheme: dark)"),
  init() {
    this.colorSchemeQuery.addEventListener("change", () => {
      this.updateColorScheme();
    });
    this.updateColorScheme();
  },
  updateColorScheme() {
    this.colorScheme = this.colorSchemeQuery.matches ? "dark" : "light";
  },
}));

Alpine.data("pagination", () => ({
  current: 0,
  total: 0,
  init() {
    const el = this.$el as HTMLElement;
    this.current = parseInt(el.dataset.page || "1");
    this.total = parseInt(el.dataset.total || "0");

    if (isNaN(this.current)) {
      const match = window.location.pathname.match(/\/page\/(\d+)/);
      this.current = match ? parseInt(match[1]) : 1;
    }
  },
  get pages() {
    const range: (number | string)[] = [];
    const delta = 2;
    const left = this.current - delta;
    const right = this.current + delta + 1;
    for (let i = 1; i <= this.total; i++) {
      if (i === 1 || i === this.total || (i >= left && i < right)) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  },
  makeUrl(page: number | string) {
    if (typeof page === "string") return "#";

    const path = window.location.pathname;
    let cleanPath = path.replace(/\/page\/\d+\/?$/, "");
    if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
      cleanPath = cleanPath.slice(0, -1);
    }
    if (cleanPath === "") cleanPath = "/";

    if (page === 1) return cleanPath;

    const separator = cleanPath.endsWith("/") ? "" : "/";
    return cleanPath + separator + "page/" + page;
  },
  jump(page: number) {
    if (page >= 1 && page <= this.total) {
      window.location.href = this.makeUrl(page);
    }
  },
}));

Alpine.start();
