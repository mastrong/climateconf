
/* Load header logo */
fetch("/static/vc-logo.svg")
  .then(r => r.text())
  .then(svg => {
    const node = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
    const slot = document.getElementById("vcLogoHeader");
    if (slot) slot.appendChild(node.cloneNode(true));
  });

/* Load committee data from external file */
let committee = [];
function loadCommittee() {
  return fetch("/static/committee.json")
    .then(r => r.json())
    .then(data => { committee = data; });
}

/* Render committee */
function renderCommittee() {
  const container = document.getElementById("committee");
  if (!container) return;
  committee.forEach(m => {
    const el = document.createElement("div");
    el.className = "committee_member";
    el.dataset.bio = m.bio;
    el.innerHTML = `
      <div class="avatar" style="background-image:url('${m.photo}')"></div>
      <div>
        <h4>${m.name}</h4>
        <p>${m.institution}</p>
      </div>`;
    container.appendChild(el);
  });
}

/* Dynamically set width of 3rd speaker based on size  */
function syncOrphanSpeakerWidth() {
  const speakersSection = document.getElementById('speakers');
  if (!speakersSection) return; // not on homepage

  const grid = speakersSection.querySelector('.speakers-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.speaker');
  if (cards.length < 3) return;

  const orphan = cards[cards.length - 1];
  const isTablet = window.matchMedia('(min-width: 640px) and (max-width: 1023px)').matches;

  if (!isTablet) {
    orphan.style.maxWidth = '';
    return;
  }

  const referenceWidth = cards[0].offsetWidth;
  if (referenceWidth > 0) {
    orphan.style.maxWidth = `${referenceWidth}px`;
  }
}

/* Modal logic */
function initModal(modalId, openBtnId, closeBtnId) {
  const modal = document.getElementById(modalId);
  const openBtn = document.getElementById(openBtnId);
  const closeBtn = document.getElementById(closeBtnId);
  if (openBtn) openBtn.onclick = () => modal.style.display = "block";
  if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
}

/* Tabs */
function initTabs(btnSel, contentSel) {
  const buttons = document.querySelectorAll(btnSel);
  const content = document.querySelectorAll(contentSel);
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.tab);
      buttons.forEach(b => b.classList.remove("active"));
      content.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      if (target) target.classList.add("active");
    });
  });
}

/* Navbar */
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
  });
}

/* Committee modal */
function initCommitteeModal() {
  // Ensure modal exists (create once if missing)
  let modal = document.getElementById("bioModal");
  if (!modal) {
    document.body.insertAdjacentHTML("beforeend", `
      <div id="bioModal" class="modal">
        <div class="modal-content">
          <span class="close" id="bioModalClose">&times;</span>
          <div id="bioContent"></div>
        </div>
      </div>`);
    modal = document.getElementById("bioModal");
  }

  const closeBtn = modal.querySelector(".close");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Click on backdrop closes modal
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Open modal when clicking a committee card
  document.querySelectorAll(".committee_member").forEach(card => {
    card.addEventListener("click", () => {
      const box = document.getElementById("bioContent");
      if (!box) return;
      box.innerHTML = `
        <h3>${card.querySelector("h4").innerText}</h3>
        <p><strong>${card.querySelector("p").innerText}</strong></p>
        <p>${card.dataset.bio}</p>`;
      modal.style.display = "block";
    });
  });
}

// /* Localization */
// function localizeSpelling() {
//   const lang = (navigator.language || "en-US").toLowerCase();
//   if (lang === "en-us") return;
//   const map = {
//     visualize:"visualise", visualizes:"visualises", visualized:"visualised",
//     visualizing:"visualising", visualization:"visualisation",
//     visualizations:"visualisations"
//   };
//   const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
//   while (walker.nextNode()) {
//     let t = walker.currentNode.nodeValue;
//     for (const [us, uk] of Object.entries(map)) {
//       t = t.replace(new RegExp(`\b${us}\b`, "gi"), m => m[0]===m[0].toUpperCase()?uk[0].toUpperCase()+uk.slice(1):uk);
//     }
//     walker.currentNode.nodeValue = t;
//   }
// }

document.addEventListener("DOMContentLoaded", () => {
  loadCommittee().then(() => {
    renderCommittee();
    initCommitteeModal();
  });

  loadInstitutions().then(() => {
    renderInstitutions();
  });

  initNavbar();
  initTabs(".tab-button", ".tab-content");
  initTabs(".venue-tab", ".venue-tab-content");
  initModal("venueModal", "venueModalBtn", "venueModalClose");
  localizeSpelling();
});


document.querySelectorAll('.dropdown-toggle').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const menu = btn.nextElementSibling;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });
});

// close dropdown if clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.style.display = 'none';
  });
});

let institutions = [];

function loadInstitutions() {
  return fetch("/static/institutions.json")
    .then(r => r.json())
    .then(data => { institutions = data; });
}

function renderInstitutions() {
  const container = document.getElementById("institutionsList");
  if (!container) return;

  institutions.forEach(inst => {
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
}


document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(syncOrphanSpeakerWidth);
  });
});

window.addEventListener('resize', syncOrphanSpeakerWidth);

