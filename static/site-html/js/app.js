document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('vc-menu-overlay');
  var openBtn = document.getElementById('vc-menu-toggle');
  var closeBtn = document.getElementById('vc-menu-close');

  if (openBtn) openBtn.addEventListener('click', function () {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  if (closeBtn) closeBtn.addEventListener('click', function () {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ---- Global search (navbar + menu overlay) ----
  var INDEX = (typeof VC_SEARCH_INDEX !== 'undefined') ? VC_SEARCH_INDEX : [];

  function search(query) {
    var q = query.trim().toLowerCase();
    if (!q) return [];
    return INDEX.filter(function (item) {
      return item.title.toLowerCase().indexOf(q) !== -1 ||
             item.authors.toLowerCase().indexOf(q) !== -1 ||
             item.section.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);
  }

  function renderResults(container, results, root) {
    if (!results.length) {
      container.innerHTML = '<div class="vc-search-empty">No results</div>';
      container.classList.add('open');
      return;
    }
    container.innerHTML = results.map(function (r) {
      return '<a class="vc-search-result" href="' + root + r.url + '">' +
        '<span class="vc-search-result-title">' + escapeHtml(r.title) + '</span>' +
        '<span class="vc-search-result-meta">' + escapeHtml(r.section) + ' &middot; ' + escapeHtml(r.authors) + '</span>' +
        '</a>';
    }).join('');
    container.classList.add('open');
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function wireSearch(inputId, resultsId, wrapId) {
    var input = document.getElementById(inputId);
    var results = document.getElementById(resultsId);
    var wrap = document.getElementById(wrapId);
    if (!input || !results || !wrap) return;
    var root = input.getAttribute('data-root') || '';

    function run() {
      var matches = search(input.value);
      if (!input.value.trim()) {
        results.classList.remove('open');
        results.innerHTML = '';
        return;
      }
      renderResults(results, matches, root);
    }

    input.addEventListener('input', run);
    input.addEventListener('focus', run);
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) {
        results.classList.remove('open');
      }
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        results.classList.remove('open');
        input.blur();
      } else if (e.key === 'Enter') {
        var first = results.querySelector('.vc-search-result');
        if (first) window.location.href = first.getAttribute('href');
      }
    });
  }

  wireSearch('vc-search-input', 'vc-search-results', 'vc-search-wrap');
  wireSearch('vc-menu-search-input', 'vc-menu-search-results', 'vc-menu-search-wrap');

  var searchBtn = document.getElementById('vc-search-btn');
  if (searchBtn) searchBtn.addEventListener('click', function () {
    var input = document.getElementById('vc-search-input');
    var first = document.querySelector('#vc-search-results .vc-search-result');
    if (first) window.location.href = first.getAttribute('href');
    else if (input) input.focus();
  });
});

// When embedded in the main site's iframe, links back to the main site should
// replace the whole page rather than load inside the frame.
document.addEventListener('DOMContentLoaded', function () {
  if (window.self === window.top) return;
  document.querySelectorAll('a[href^="https://visualisingclimate.com"]').forEach(function (a) {
    a.target = '_top';
  });
});
