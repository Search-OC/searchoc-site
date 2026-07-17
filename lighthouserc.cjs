module.exports = {
  ci: {
    collect: {
      // We serve dist/ ourselves in CI. Collect against explicit localhost URLs.
      url: ['http://localhost:8080/', 'http://localhost:8080/formation/']
    },
    upload: {
      // Avoid LHCI upload; we upload artifacts ourselves.
      target: 'temporary-public-storage'
    }
  }
};
