import * as path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  context: path.join(__dirname, 'src'),
  entry: './index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/assets',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'static'),
    host: '0.0.0.0',
  },
};

export default config;