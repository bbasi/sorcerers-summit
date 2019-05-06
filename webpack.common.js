 const path = require('path');

 module.exports = {
   entry: {
     app: './src/_idx.js'
   },
   output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
   },
   module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
 };