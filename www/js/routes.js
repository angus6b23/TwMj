
var routes = [
    {
        path: '/',
        url: './index.html',
    },
    {
        path: '/about/',
        url: './pages/about.html',
    },
    {
        path: '/license/',
        url: './pages/license.html',
    },
    {
        path: '/import/',
        url: './pages/import.html',
    },
    {
        path: '/deal/',
        url: './pages/deal.html',
    },
    {
        path: '/start/',
        url: './pages/start.html',
    },
    {
        path: '/tsumo/',
        url: './pages/tsumo.html',
    },
    {
        path: '/instantGet/',
        url: './pages/instantGet.html'
    },
    {
        path: '/instantPay/',
        url: './pages/instantPay.html'
    },
    {
        path: '/settings/',
        url: './pages/settings.html',
    },
    {
        path: '/stats/',
        url: './pages/stats.html',
    },
    {
        path: '/dynamic-route/blog/:blogId/post/:postId/',
        componentUrl: './pages/dynamic-route.html',
    },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
