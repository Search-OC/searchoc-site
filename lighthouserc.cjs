module.exports = {
  ci: {
    collect: {
      // Run LHCI against the built Astro site
      staticDistDir: './dist',
      // With staticDistDir, LHCI expects explicit localhost URLs so it can
      // substitute the temporary port it starts the static server on.
      url: ['http://localhost/', 'http://localhost/formation/']
    },
    // Do not rely on LHCI's assert/upload phases in CI; we run a deterministic
    // assert step (scripts/assert-lighthouse.mjs) and upload artifacts ourselves.
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
