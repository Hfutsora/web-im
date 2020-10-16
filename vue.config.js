const path = require('path');

// function resolve(dir) {
//   return path.join(__dirname, dir);
// }

// const name = 'web-im';

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
      ],
    },
  },
};
