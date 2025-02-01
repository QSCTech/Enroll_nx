const path = require('path');

module.exports = {
  // Multiple entry points
  entry: {
    "content-script": './src/content-script.js',
    background: './src/background.js',
    options: './src/options.js',
    popup: './src/popup.js',
  },

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: '[name].js', // Use [name] to differentiate output files for each entry point
    clean: true, // Clean the output directory before emitting new files
  },
  mode: 'production'
  // Module rules for handling different file types
//   module: {
//     rules: [
//       {
//         // Rule for JavaScript files
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env'], // Transpile ES6+ to ES5
//           },
//         },
//       },
//     ],
//   },

  // Development server configuration
//   devServer: {
//     static: './dist', // Serve files from the output directory
//     open: true, // Open the browser automatically
//     hot: true, // Enable hot module replacement
//   },

  // Optimization configuration
//   optimization: {
//     runtimeChunk: 'single', // Create a separate runtime chunk
//     splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendors',
    //       chunks: 'all',
    //     },
    //   },
    // },
//   },
};