module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/pages/:slug',
        handler: 'page-custom.findBySlug',
        config: {
          auth: false,
        },
      },
      {
        method: 'PUT',
        path: '/pages/:slug',
        handler: 'page-custom.updateBySlug',
        config: {
          auth: {
            scope: ['authenticated'],
          },
        },
      },
      {
        method: 'DELETE',
        path: '/pages/:slug',
        handler: 'page-custom.deleteBySlug',
        config: {
          auth: {
            scope: ['authenticated'],
          },
        },
      },
    ],
  };