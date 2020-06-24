let newWorker;
(function() {
  'use strict';
if ('serviceWorker' in navigator) {
    console.log('el browser si acepta service worker');
    navigator.serviceWorker
             .register('jlvdantry.js')
             .then( function () {
                             console.log('registro el service worker');
            })
   }
})();

