// Import Workbox (https://developers.google.com/web/tools/workbox/)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

workbox.precaching.precacheAndRoute([
    'framework7/framework7-bundle.min.css',
    'framework7/framework7-bundle.min.js',
    'css/icons.css',
    'js/store.js',
    'js/html2canvas.min.js',
    'js/chart.min.js',
    'fonts/Framework7Icons-Regular.woff2',
    'fonts/Framework7Icons-Regular.woff',
    'fonts/material-icons.woff2',
    'fonts/material-icons.woff',
    'assets/icons/128x128.png',
    'assets/icons/144x144.png',
    'assets/icons/152x152.png',
    'assets/icons/192x192.png',
    'assets/icons/256x256.png',
    'assets/icons/512x512.png',
    'assets/icons/favicon.png',
    'assets/icons/apple-touch-icon.png'
]);
/*
  Precache Manifest
  Change revision as soon as file content changed
*/
/*
self.__WB_MANIFEST = [
  {
    revision: '1',
    url: 'framework7/framework7-bundle.min.css'
  },
  {
    revision: '1',
    url: 'framework7/framework7-bundle.min.js'
  },
  {
    revision: '1',
    url: 'css/app.css'
  },
  {
    revision: '1',
    url: 'css/icons.css'
  },
  {
    revision: '1',
    url: 'js/routes.js'
  },
  {
    revision: '1',
    url: 'js/store.js'
  },
  {
    revision: '1',
    url: 'js/app.js'
  },
  // Fonts
  {
    revision: '1',
    url: 'fonts/Framework7Icons-Regular.woff2'
  },
  {
    revision: '1',
    url: 'fonts/Framework7Icons-Regular.woff'
  },
  {
    revision: '1',
    url: 'fonts/material-icons.woff2'
  },
  {
    revision: '1',
    url: 'fonts/material-icons.woff'
  },
  // HTML
  {
    revision: '1',
    url: './index.html'
  },
  // Icons
  {
    revision: '1',
    url: 'assets/icons/128x128.png'
  },
  {
    revision: '1',
    url: 'assets/icons/144x144.png'
  },
  {
    revision: '1',
    url: 'assets/icons/152x152.png'
  },
  {
    revision: '1',
    url: 'assets/icons/192x192.png'
  },
  {
    revision: '1',
    url: 'assets/icons/256x256.png'
  },
  {
    revision: '1',
    url: 'assets/icons/512x512.png'
  },
  {
    revision: '1',
    url: 'assets/icons/favicon.png'
  },
  {
    revision: '1',
    url: 'assets/icons/apple-touch-icon.png'
  },
];
*/
/*
  Enable precaching
  It is better to comment next line during development
*/

workbox.routing.registerRoute(/\.html/, new workbox.strategies.NetworkFirst());
