/* Fallback: carica SortableJS da unpkg se jsdelivr non è disponibile */
if (typeof Sortable === 'undefined') {
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/sortablejs@1.15.0/Sortable.min.js';
  document.head.appendChild(s);
}
