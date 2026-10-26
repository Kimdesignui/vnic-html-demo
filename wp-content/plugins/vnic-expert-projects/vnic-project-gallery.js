(function () {
  'use strict';

  function initGallery(root) {
    var triggers = Array.prototype.slice.call(root.querySelectorAll('.vnic-project-gallery-trigger'));
    var modal = root.querySelector('.vnic-project-lightbox');
    var image = root.querySelector('[data-gallery-image]');
    var counter = root.querySelector('[data-gallery-counter]');
    var thumbs = root.querySelector('[data-gallery-thumbs]');
    var featured = root.querySelector('.vnic-project-gallery-featured img');
    if (!triggers.length || !modal || !image) return;
    var current = 0;
    var scale = 1;

    triggers.forEach(function (trigger, index) {
      var thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'vnic-project-lightbox-thumb';
      thumb.setAttribute('aria-label', 'Mở ảnh ' + (index + 1));
      thumb.dataset.galleryThumb = String(index);
      thumb.innerHTML = '<img src="' + trigger.querySelector('img').getAttribute('src') + '" alt="">';
      thumbs.appendChild(thumb);
      trigger.addEventListener('click', function () {
        if (trigger.classList.contains('vnic-project-gallery-thumbnail')) {
          showPreview(index);
          open(index);
          return;
        }
        open(index);
      });
      thumb.addEventListener('click', function () { show(index); });
    });

    function show(index) {
      current = (index + triggers.length) % triggers.length;
      var trigger = triggers[current];
      image.src = trigger.dataset.galleryFull;
      image.alt = trigger.dataset.galleryAlt || '';
      scale = 1;
      image.className = 'is-zoom-100';
      counter.textContent = (current + 1) + ' / ' + triggers.length;
      Array.prototype.forEach.call(thumbs.children, function (thumb, thumbIndex) {
        thumb.classList.toggle('is-active', thumbIndex === current);
      });
    }
    function showPreview(index) {
      var trigger = triggers[index];
      if (!featured || !trigger) return;
      featured.src = trigger.dataset.galleryFull;
      featured.alt = trigger.dataset.galleryAlt || '';
      Array.prototype.forEach.call(root.querySelectorAll('.vnic-project-gallery-thumbnail'), function (thumb) {
        thumb.classList.toggle('is-active', thumb.dataset.galleryIndex === String(index));
      });
    }
    function open(index) {
      if (modal.parentNode !== document.body) {
        document.body.appendChild(modal);
      }
      show(index);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('vnic-lightbox-open');
    }
    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('vnic-lightbox-open');
    }
    root.querySelector('[data-gallery-prev]').addEventListener('click', function () { show(current - 1); });
    root.querySelector('[data-gallery-next]').addEventListener('click', function () { show(current + 1); });
    root.querySelectorAll('[data-gallery-close]').forEach(function (button) { button.addEventListener('click', close); });
    root.querySelector('[data-gallery-zoom-in]').addEventListener('click', function () { scale = Math.min(2.5, scale + .25); image.className = 'is-zoom-' + Math.round(scale * 100); });
    root.querySelector('[data-gallery-zoom-out]').addEventListener('click', function () { scale = Math.max(1, scale - .25); image.className = 'is-zoom-' + Math.round(scale * 100); });
    root.querySelector('[data-gallery-fullscreen]').addEventListener('click', function () {
      var panel = root.querySelector('.vnic-project-lightbox-panel');
      if (document.fullscreenElement) document.exitFullscreen();
      else if (panel.requestFullscreen) panel.requestFullscreen();
    });
    document.addEventListener('keydown', function (event) {
      if (!modal.classList.contains('is-open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
  }

  document.querySelectorAll('[data-vnic-gallery]').forEach(initGallery);
})();
