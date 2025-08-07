const loadComponent = async (id, file) => {
  try {
    const res = await fetch(`/html/layout/${file}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;

    if (id === "header") {
      const toggleBtn = document.getElementById("toggleSidebarBtn");
      const sidebar = document.getElementById("sidebar");

      if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
          sidebar.classList.toggle("d-none");
        });
      }
    }

    if (id === "sidebar") {
      const params = new URLSearchParams(window.location.search);
      const currentPage = params.get("page");

      document.querySelectorAll(".nav-link-custom").forEach((link) => {
        const linkPage = new URL(link.href).searchParams.get("page");
        if (linkPage === currentPage) {
          link.classList.add("active");
        }
      });
    }
  } catch (err) {
    console.error(`Không thể load ${file}:`, err);
  }
};

const loadPageContent = async () => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") || "home"; // fallback nếu không có param

  try {
    const res = await fetch(`/html/page/${page}.html`);
    const html = await res.text();
    document.getElementById("content").innerHTML = html;
  } catch (err) {
    document.getElementById(
      "content"
    ).innerHTML = `<div class="alert alert-danger">Không thể tải trang: ${page}</div>`;
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") || "home";

  if (page !== "login") {
    await loadComponent("head", "head.html");
    await loadComponent("header", "header.html");
    await loadComponent("sidebar", "sidebar.html");
    await loadComponent("footer", "footer.html");
  }

  await loadPageContent();
});
