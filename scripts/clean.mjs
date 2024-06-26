#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const config = {
  CLEAN_DRY: process.env.CLEAN_DRY === 'true' || false,
  CLEAN_CACHES: process.env.CLEAN_CACHES === 'true' || false,
  CLEAN_YARN: process.env.CLEAN_YARN === 'true' || false,
  CLEAN_GENERATED: process.env.CLEAN_GENERATED === 'true' || false,
  CLEAN_NODE_MODULES: process.env.CLEAN_NODE_MODULES === 'true' || false,
  CLEAN_ALL: process.env.CLEAN_ALL === 'true' || false,
  CLEAN_CACHES_LIST: ['.cache', 'dist'],
  CLEAN_YARN_IGNORES_LIST: ['patches', 'releases'],
  SEARCH_DIRECTORIES: ['apps', 'libs'],
  GENERATED_PATTERNS: [
    'openapi.yaml',
    'api.graphql',
    'schema.d.ts',
    'schema.tsx',
    'schema.ts',
    'gen/graphql.ts',
    '*.generated.ts',
    'possibleTypes.json',
    'fragmentTypes.json',
  ],
  DIRS_TO_DELETE: ['gen/fetch'],
}

function log(...messages) {
  console.error(...messages)
}

function dry(message) {
  if (config.CLEAN_DRY) {
    log(`Dry run: ${message}`)
    return true
  }
  return false
}

function showHelp() {
  console.log(`Usage: ${process.argv[1]} [OPTIONS]

Options:
  --generated        Clean generated files
  --yarn             Clean yarn files
  --cache            Clean cache files
  --node-modules     Clean node_modules folder
  --all              Clean all (generated, yarn, cache, and node_modules files)
  -n, --dry          Dry run (show what would be done without actually doing it)
  -h, --help         Show this help message`)
}

function parseArgs(args) {
  if (args.length === 0) {
    showHelp()
    process.exit(0)
  }

  args.forEach((arg) => {
    switch (arg) {
      case '--generated':
        config.CLEAN_GENERATED = true
        break
      case '--yarn':
        config.CLEAN_YARN = true
        break
      case '--cache':
        config.CLEAN_CACHES = true
        break
      case '--node-modules':
        config.CLEAN_NODE_MODULES = true
        break
      case '--all':
        config.CLEAN_ALL = true
        break
      case '-n':
      case '--dry':
        config.CLEAN_DRY = true
        break
      case '-h':
      case '--help':
        showHelp()
        process.exit(0)
      default:
        showHelp()
        process.exit(1)
    }
  })

  if (config.CLEAN_ALL) {
    config.CLEAN_GENERATED = true
    config.CLEAN_YARN = true
    config.CLEAN_CACHES = true
    config.CLEAN_NODE_MODULES = true
  }
}

function isGitTracked(filePath) {
  try {
    execSync(`git ls-files --error-unmatch ${filePath}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/**
 * Recursively finds and deletes files or directories based on given conditions.
 *
 * @param {string} baseDir - The base directory to start the search from.
 * @param {function} patternCheck - A function that takes a file path and returns true if the file path matches the pattern.
 * @param {boolean} deleteDirectories - Whether to delete directories that match the pattern.
 */
function findAndDelete(baseDir, patternCheck, deleteDirectories = false) {
  function walkSync(currentDirPath) {
    if (currentDirPath.includes('node_modules')) return

    fs.readdirSync(currentDirPath).forEach((name) => {
      const filePath = path.join(currentDirPath, name)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        if (deleteDirectories && patternCheck(filePath)) {
          if (!dry(`Would delete directory: ${filePath}`)) {
            log(`Deleting directory now: ${filePath}`)
            fs.rmSync(filePath, { recursive: true, force: true })
          }
        } else {
          walkSync(filePath)
        }
        return
      }

      if (!stat.isFile()) return

      if (!patternCheck(filePath)) return

      if (isGitTracked(filePath)) {
        log(`Skipping git-tracked file: ${filePath}`)
        return
      }

      if (!dry(`Would delete: ${filePath}`)) {
        log(`Deleting now: ${filePath}`)
        fs.unlinkSync(filePath)
      }
    })
  }

  walkSync(baseDir)
}

function cleanGenerated() {
  const patterns = config.GENERATED_PATTERNS.map(
    (pattern) => new RegExp('/' + pattern.replace(/\*/g, '.*')),
  )

  config.SEARCH_DIRECTORIES.forEach((baseDir) => {
    if (fs.existsSync(baseDir)) {
      findAndDelete(baseDir, (filePath) =>
        patterns.some((regex) => regex.test(filePath)),
      )
      config.DIRS_TO_DELETE.forEach((dirToDelete) => {
        findAndDelete(
          baseDir,
          (filePath) => filePath.includes(dirToDelete),
          true, // Indicate that we are deleting directories
        )
      })
    }
  })
}

function cleanCaches() {
  const yarnCacheFolder = execSync('yarn config get cacheFolder', {
    encoding: 'utf-8',
  }).trim()

  const cachesToDelete = [...config.CLEAN_CACHES_LIST, yarnCacheFolder]

  cachesToDelete.forEach((item) => {
    if (fs.existsSync(item)) {
      if (!dry(`Would delete: ${item}`)) {
        log(`Deleting now: ${item}`)
        fs.rmSync(item, { recursive: true, force: true })
      }
    } else {
      log(`Skipping ${item}: directory does not exist`)
    }
  })

  config.SEARCH_DIRECTORIES.forEach((baseDir) => {
    if (fs.existsSync(baseDir)) {
      findAndDelete(
        baseDir,
        (filePath) => path.basename(filePath) === 'dist',
        true, // Indicate that we are deleting directories
      )
    }
  })
}

function cleanYarn() {
  if (!fs.existsSync('.yarn')) {
    log('No .yarn folder')
    return
  }

  fs.readdirSync('.yarn').forEach((item) => {
    const fullPath = path.join('.yarn', item)
    if (!config.CLEAN_YARN_IGNORES_LIST.includes(item)) {
      const stat = fs.statSync(fullPath)
      if (!dry(`Would delete: ${fullPath}`)) {
        if (stat.isDirectory()) {
          log(`Deleting directory now: ${fullPath}`)
          fs.rmSync(fullPath, { recursive: true, force: true })
        } else if (stat.isFile()) {
          log(`Deleting file now: ${fullPath}`)
          fs.unlinkSync(fullPath)
        }
      }
    }
  })
}

function cleanNodeModules() {
  config.SEARCH_DIRECTORIES.forEach((baseDir) => {
    if (fs.existsSync(baseDir)) {
      findAndDelete(
        baseDir,
        (filePath) => path.basename(filePath) === 'node_modules',
        true, // Indicate that we are deleting directories
      )
    }
  })

  if (fs.existsSync('node_modules')) {
    if (!dry(`Would delete: node_modules`)) {
      log(`Deleting now: node_modules`)
      fs.rmSync('node_modules', { recursive: true, force: true })
    }
  } else {
    log('Skipping root node_modules: directory does not exist')
  }
}

function cleanAll() {
  const tasks = [
    {
      name: 'generated files',
      flag: config.CLEAN_GENERATED,
      func: cleanGenerated,
    },
    { name: 'cache files', flag: config.CLEAN_CACHES, func: cleanCaches },
    { name: 'yarn files', flag: config.CLEAN_YARN, func: cleanYarn },
    {
      name: 'node_modules',
      flag: config.CLEAN_NODE_MODULES,
      func: cleanNodeModules,
    },
  ]

  tasks.forEach(({ name, flag, func }) => {
    if (flag) {
      log(`Cleaning ${name}`)
      func()
    } else {
      log(`Skipping ${name}`)
    }
  })
}

parseArgs(process.argv.slice(2))
cleanAll()
