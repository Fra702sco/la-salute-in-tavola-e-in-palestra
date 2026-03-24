/* Fallback: carica SortableJS da unpkg se jsdelivr non è disponibile */
if (typeof Sortable === 'undefined') {
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/sortablejs@1.15.0/Sortable.min.js';
  s.integrity = 'sha384-eeLEhtwdMwD3X9y+8P3Cn7Idl/M+w8H4uZqkgD/2eJVkWIN1yKzEj6XegJ9dL3q0';
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
}
