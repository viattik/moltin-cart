const withSass = require('@zeit/next-sass');
const path = require('path');

module.exports = withSass({
  distDir: '.build',
  webpack: (config) => {
    config.resolve.modules.push(path.resolve('./'));
    config.node = {
      fs: 'empty',
    };
    return config;
  },
});
