(function () {
  'use strict';

  var pageSize = 12;
  var activeFilter = 'all';
  var activePage = 1;

  function getCategory(card) {
    var label = (card.querySelector('.vnic-project-meta') || {}).textContent || '';
    var value = label.toLowerCase();

    if (value.indexOf('y tế') !== -1) return 'y-te';
    if (value.indexOf('giáo dục') !== -1) return 'giao-duc';
    if (value.indexOf('nhà ở') !== -1) return 'nha-o';
    if (value.indexOf('hành chính') !== -1 || value.indexOf('văn phòng') !== -1) return 'hanh-chinh';
    if (value.indexOf('du lịch') !== -1 || value.indexOf('khách sạn') !== -1) return 'du-lich';
    if (value.indexOf('quy hoạch') !== -1 || value.indexOf('hạ tầng') !== -1) return 'ha-tang';
    return 'other';
  }

  function render(section, cards, rows, pagination) {
    var filtered = cards.filter(function (card) {
      return activeFilter === 'all' || getCategory(card) === activeFilter;
    });
    var pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    activePage = Math.min(activePage, pages);
    var start = (activePage - 1) * pageSize;
    var visible = filtered.slice(start, start + pageSize);

    cards.forEach(function (card) {
      card.classList.toggle('is-project-hidden', visible.indexOf(card) === -1);
    });

    rows.forEach(function (row) {
      row.classList.toggle('is-project-row-hidden', !row.querySelector('.vnic-project-item:not(.is-project-hidden)'));
    });

    pagination.replaceChildren();
    if (pages > 1) {
      for (var number = 1; number <= pages; number += 1) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'vnic-project-page' + (number === activePage ? ' is-active' : '');
        button.textContent = number;
        button.setAttribute('aria-label', 'Trang dự án ' + number);
        button.addEventListener('click', function (event) {
          activePage = Number(event.currentTarget.textContent);
          render(section, cards, rows, pagination);
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        pagination.appendChild(button);
      }
    }
  }

  function makeProjectCardsClickable(cards) {
    cards.forEach(function (card) {
      var inner = card.querySelector(':scope > .col-inner');
      var detailLink = card.querySelector('.button-wrapper a[href], :scope > .col-inner > a[href]');

      if (!inner || !detailLink || inner.querySelector('.vnic-project-card-link')) return;

      var cardLink = document.createElement('a');
      var title = card.querySelector('h3');
      cardLink.className = 'vnic-project-card-link';
      cardLink.href = detailLink.href;
      cardLink.setAttribute('aria-label', title ? 'Xem chi tiết ' + title.textContent.trim() : 'Xem chi tiết dự án');
      inner.insertBefore(cardLink, inner.firstChild);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var section = document.querySelector('.vnic-project-list-section');
    if (!section) return;

    var cards = Array.prototype.slice.call(section.querySelectorAll('.vnic-project-item'));
    var rows = Array.prototype.slice.call(section.querySelectorAll('.vnic-project-list-row'));
    var pagination = section.querySelector('.vnic-project-pagination nav');
    var filters = Array.prototype.slice.call(document.querySelectorAll('.vnic-project-filter'));
    if (!pagination) return;

    makeProjectCardsClickable(cards);

    cards.forEach(function (card) {
      card.querySelectorAll('img').forEach(function (image) {
        image.loading = 'eager';
      });
    });

    filters.forEach(function (filter) {
      filter.addEventListener('click', function (event) {
        event.preventDefault();
        activeFilter = filter.className.match(/vnic-project-filter--([a-z-]+)/)[1];
        activePage = 1;
        filters.forEach(function (item) { item.classList.remove('is-active'); });
        filter.classList.add('is-active');
        render(section, cards, rows, pagination);
      });
    });

    render(section, cards, rows, pagination);
  });
}());
