module.exports = {
  ci: {
    collect: {
      // Run LHCI against the built Astro site
      staticDistDir: './dist',
      url: ['/', '/formation/']
    },
    upload: {
      target: 'filesystem'
    }
  }
};
