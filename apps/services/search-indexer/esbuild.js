const esbuild = require('esbuild')
// const path = require('path')

// const basePath = 'apps/services/search-indexer/src'

// const entryPoints = {
//   migrateAws: path.join(basePath, './migrate/migrateAws.ts'),
//   migrateElastic: path.join(basePath, './migrate/migrateElastic.ts'),
//   migrateKibana: path.join(basePath, './migrate/migrateKibana.ts'),
// }

esbuild
  .build({
    // entryPoints: entryPoints,
    bundle: true,
    platform: 'node',
    splitting: true,
    format: 'esm',
    outdir: 'dist/apps/services/search-indexer',
    chunkNames: '[dir]/[name]',
    sourcemap: true,
    logLevel: 'info',
    external: [
      'fsevents',
      '@nestjs/microservices',
      'class-transformer',
      'cache-manager',
      '@nestjs/websockets/socket-module',
      'class-validator',
      'class-transformer',
      '@nestjs/microservices/microservices-module',
      'apollo-server-fastify',
      '@elastic/elasticsearch',
      'fastify-swagger',
      '@nestjs/mongoose',
      '@nestjs/typeorm',
      'dd-trace',
      'express',
      'http-errors',
      'graphql',
      'pg',
      'winston',
      'util-deprecate',
      'source-map-resolve',
      'atob',
      'logform',
      'pg-native',
      'form-data',
      '@mikro-orm/core',
      '@protobufjs/aspromise',
      '@protobufjs/base64',
      '@protobufjs/codegen',
      '@protobufjs/eventemitter',
      '@protobufjs/fetch',
      '@protobufjs/float',
      '@protobufjs/inquire',
      '@protobufjs/path',
      '@protobufjs/pool',
      '@protobufjs/utf8',
      'safer-buffer',
    ],
    keepNames: true,
  })
  .catch((e) => {
    throw new Error(e)
  })
