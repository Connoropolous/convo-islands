const path = require('path');

module.exports = {
  entry: './conversation-graph/index.js',
  output: {
    path: path.resolve(__dirname, 'conversation-graph'),
    filename: 'convo-graph.bundle.js'
  },
  mode: 'development'
};