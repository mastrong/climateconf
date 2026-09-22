let institutionGroups = [];

function loadInstitutions() {
  return fetch("/static/institutions.json")
    .then(r => r.json())
    .then(data => { institutionGroups = data; });
}

function renderInstitutions() {
  const container = document.getElementById("institutionsList");
  if (!container) return;

  institutionGroups.forEach(group => {
    if (group.category) {
      const heading = document.createElement("h3");
      heading.className = "institution-category";
      heading.textContent = group.category;
      container.appendChild(heading);
    }

    (group.institutions || []).forEach(inst => {
      const el = document.createElement("div");
      el.className = "institution-full";

      // Ensure logos is always an array
      const logos = Array.isArray(inst.logos) ? inst.logos : [];

      const logosHTML = `
        <div class="institution-multi-logos">
          ${logos.map(l => `
            <a href="${l.href || '#'}" target="_blank" rel="noopener noreferrer">
              <div class="institution-logo" style="background-image:url('${l.src}')"></div>
            </a>
          `).join("")}
        </div>
      `;

      el.innerHTML = `
        ${logosHTML}
        <h3>${inst.name}</h3>
        <p>${inst.text}</p>
      `;

      container.appendChild(el);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadInstitutions().then(renderInstitutions);
});
