import * as webpack from 'webpack'
import { resolve } from 'path'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'

export const cfg = (config: webpack.Configuration) => {
  // @ts-ignore
  nrwlConfig(config) // first call it so that it @nrwl/react plugin adds its configs,
  console.log(config)
  return config as webpack.Configuration
  // config.plugins = [
  //   ...config.plugins,
  //   new webpack.IgnorePlugin({
  //     checkResource(resource) {
  //       const lazyImports = [
  //         '@nestjs/microservices',
  //         '@nestjs/platform-express',
  //         'cache-manager',
  //         'class-validator',
  //         'class-transformer',
  //       ]
  //       if (!lazyImports.includes(resource)) {
  //         return false
  //       }
  //       try {
  //         require.resolve(resource)
  //       } catch (err) {
  //         return true
  //       }
  //       return false
  //     },
  //   }),
  // ]
  // return {
  //   ...config,
  // }
}
// https://webpack.js.org/guides/typescript/

export const sample: webpack.Configuration = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        // use: 'ts-loader',
        use: [
          {
            loader: 'babel-loader',
            // options: {
            //   presets: ['@babel/preset-env'],
            // },
          },
        ],
      },
    ],
  },
  target: 'node',
  entry: [
    // resolve(__dirname, './src/support/index.ts'),
    resolve(__dirname, './src/integration/applications/parental-leave.spec.ts'),
  ],
  mode: 'development',
  plugins: [
    new webpack.IgnorePlugin({
      checkResource: (resource: string) => {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/mongoose',
          '@nestjs/typeorm',
          '@nestjs/platform-express',
          'cache-manager',
          'class-validator',
          'class-transformer',
        ]

        if (lazyImports.some((i) => resource.startsWith(i))) {
          console.debug(`Ignoring ${resource}`)
          // return false
        }
        return true
      },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    roots: ['../../'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: resolve(
          __dirname,
          'tsconfig.json',
        ) /* options: see below */,
      }),
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'dist'),
  },
}

module.exports = sample
