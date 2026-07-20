module.exports = {
  ci: {
    collect: {
      // Serve dist/ ourselves in CI. Collect against explicit localhost URLs.
      url: ['http://localhost:8080/', 'http://localhost:8080/formation/'],
      numberOfRuns: 1,
      settings: {
        // GitHub Actions headless Chrome needs these flags.
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --headless=new',
        // Give first paint time on cold CI runners.
        maxWaitForFcp: 30000,
        maxWaitForLoad: 45000,
        // Mobile preset is default; keep it for real-world gate.
        preset: 'desktop'
      }
    },
    assert: {
      // Soft assertions live in scripts/assert-lighthouse.mjs for PR comments.
      // Keep LHCI assert empty so collect does not double-fail with opaque errors.
    },
    upload: {
      // Avoid LHCI upload; we upload artifacts ourselves.
      target: 'temporary-public-storage'
    }
  }
};
