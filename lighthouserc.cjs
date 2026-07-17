module.exports = {
  ci: {
    collect: {
      // Run LHCI against the built Astro site
      staticDistDir: './dist',
      url: ['/', '/formation/']
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }]
      }
    },
    upload: {
      target: 'filesystem'
    }
  }
};
