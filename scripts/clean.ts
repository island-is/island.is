#!/usr/bin/env node

import yargs from 'yargs'
import fs from 'fs'
import path from 'path'
import glob from 'glob'

interface CleanOptions {
  generated?: boolean
  yarn?: boolean
  cache?: boolean
  dry?: boolean
}

interface YargsArguments extends yargs.Arguments {
  generated: boolean
  yarn: boolean
  cache: boolean
  dry: boolean
}

let CLEAN_DRY = false
let CLEAN_CACHES = false
let CLEAN_YARN = false
let CLEAN_GENERATED = false
const CLEAN_CACHES_LIST = ['.cache', 'node_modules', 'dist']
const CLEAN_YARN_IGNORES_LIST = ['patches', 'releases']

function log(message: string): void {
  console.error(message)
}

function dry(message?: string): boolean {
  if (message) log(message)
  return CLEAN_DRY
}

function showHelp(): void {
  console.log(`
Usage:
  ./clean.js [OPTIONS]
  -f | --force    Force clean
  -d | --dry      Dry run
  -h | --help     Show help
`)
}

function cli(argv: string[]): void {
  const options: YargsArguments = yargs(argv)
    .option('generated', { type: 'boolean', default: false })
    .option('yarn', { type: 'boolean', default: false })
    .option('cache', { type: 'boolean', default: false })
    .option('dry', { alias: 'd', type: 'boolean', default: false })
    .help('h')
    .alias('h', 'help').argv as YargsArguments

  CLEAN_GENERATED = options.generated
  CLEAN_YARN = options.yarn
  CLEAN_CACHES = options.cache
  CLEAN_DRY = options.dry

  if (!CLEAN_GENERATED && !CLEAN_YARN && !CLEAN_CACHES) {
    CLEAN_GENERATED = true
    CLEAN_YARN = true
    CLEAN_CACHES = true
  }
}

function cleanGenerated(): void {
  const patterns: string[] = [
    'openapi.yaml',
    'api.graphql',
    'schema.d.ts',
    'schema.tsx',
    'schema.ts',
    '*/gen/graphql.ts',
    '*/*.generated.ts',
    'possibleTypes.json',
    'fragmentTypes.json',
  ]

  patterns.forEach((pattern) => {
    const files = glob.sync(pattern, { ignore: './.cache/*' })
    files.forEach((file) => {
      if (dry()) {
        log(`Would delete: ${file}`)
      } else {
        fs.unlinkSync(file)
      }
    })
  })

  const dirs = glob.sync('*/gen/fetch', { ignore: './.cache/*', nodir: false })
  dirs.forEach((dir) => {
    if (dry()) {
      log(`Would delete directory: ${dir}`)
    } else {
      fs.rmdirSync(dir, { recursive: true })
    }
  })
}

function cleanCaches(): void {
  if (dry()) {
    log(`Would delete: ${CLEAN_CACHES_LIST.join(', ')}`)
  } else {
    CLEAN_CACHES_LIST.forEach((item) => fs.rmdirSync(item, { recursive: true }))
  }
}

function cleanYarn(): void {
  if (!fs.existsSync('.yarn')) {
    log('No .yarn folder')
    return
  }

  const files = fs.readdirSync('.yarn')
  if (files.length === 0) {
    log('Nothing in .yarn folder')
    return
  }

  files.forEach((file) => {
    if (!CLEAN_YARN_IGNORES_LIST.includes(file)) {
      const filePath = path.join('.yarn', file)
      if (dry()) {
        log(`Would delete: ${filePath}`)
      } else {
        fs.rmdirSync(filePath, { recursive: true })
      }
    }
  })
}

function cleanAll(): void {
  const jobs: string[] = ['generated', 'caches', 'yarn']
  jobs.forEach((job) => {
    const jobUppercase = job.toUpperCase()
    const jobVariable = `CLEAN_${jobUppercase}`

    if (eval(jobVariable)) {
      log(`Cleaning ${job} files`)
      const cleanJob = eval(
        `clean${job.charAt(0).toUpperCase() + job.slice(1)}`,
      ) as () => void
      try {
        cleanJob()
      } catch (err) {
        log(`Job ${job} failed: ${(err as Error).message}`)
      }
    } else {
      log(`Skipping ${job}`)
    }
  })
}

cli(process.argv)
cleanAll()
