module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/articles/slug/:slug',
        handler: 'article-custom.findBySlug',
        config: {
          auth: false,
        },
      },
      {
        method: 'PUT',
        path: '/articles/slug/:slug',
        handler: 'article-custom.updateBySlug',
        config: {
          auth: {
            scope: ['authenticated'],
          },
        },
      },
      {
        method: 'DELETE',
        path: '/articles/slug/:slug',
        handler: 'article-custom.deleteBySlug',
        config: {
          auth: {
            scope: ['authenticated'],
          },
        },
      },
    ],
  };