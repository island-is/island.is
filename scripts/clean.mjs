#!/usr/bin/env node
// @ts-check

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const config = {
  CLEAN_DRY: process.env.CLEAN_DRY === 'true',
  CLEAN_CACHES: process.env.CLEAN_CACHES === 'true',
  CLEAN_YARN: process.env.CLEAN_YARN === 'true',
  CLEAN_GENERATED: process.env.CLEAN_GENERATED === 'true',
  CLEAN_NODE_MODULES: process.env.CLEAN_NODE_MODULES === 'true',
  CLEAN_DIST: process.env.CLEAN_DIST === 'true',
  CLEAN_ALL: process.env.CLEAN_ALL === 'true',
  CLEAN_CACHES_LIST: ['.cache'],
  CLEAN_YARN_IGNORES_LIST: ['patches', 'releases'],
  SEARCH_DIRECTORIES: ['apps', 'libs'],
  GENERATED_PATTERNS: [
    /\/openapi\.yaml$/,
    /\/api\.graphql$/,
    /\/schema\.d\.ts$/,
    /\/schema\.tsx$/,
    /\/schema\.ts$/,
    /\/gen\/graphql\.ts$/,
    /\/.*\.generated\.ts$/,
    /\/possibleTypes\.json$/,
    /\/fragmentTypes\.json$/,
  ],
  DIRS_TO_DELETE: ['gen/fetch'],
}

/**
 * Logs messages to the console.
 * @param  {...any} messages - The messages to log.
 */
function log(...messages) {
  console.error(...messages)
}

/**
 * Performs a dry run if configured.
 * @param {string} message - The message to log during a dry run.
 * @returns {boolean} - Returns true if it's a dry run.
 */
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
  --dist             Clean dist directories
  --all              Clean all (generated, yarn, cache, dist, and node_modules files)
  -n, --dry          Dry run (show what would be done without actually doing it)
  -h, --help         Show this help message`)
}

/**
 * Parses command line arguments.
 * @param {string[]} args - The command line arguments.
 */
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
      case '--dist':
        config.CLEAN_DIST = true
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
    config.CLEAN_DIST = true
  }
}

/**
 * Checks if a file is tracked by git.
 * @param {string} filePath - The path to the file.
 * @returns {boolean} - Returns true if the file is tracked by git.
 */
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
 * @param {(filePath: string) => boolean} patternCheck - A function that takes a file path and returns true if the path should be deleted.
 * @param {boolean} [deleteDirectories=false] - Whether to delete directories that match the pattern.
 */
function findAndDelete(baseDir, patternCheck, deleteDirectories = false) {
  /**
   * Recursively walks through directories and files.
   *
   * @param {string} currentDirPath - The current directory path.
   */
  function walkSync(currentDirPath) {
    if (currentDirPath.includes('node_modules')) return

    fs.readdirSync(currentDirPath).forEach((name) => {
      const filePath = path.join(currentDirPath, name)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        if (!deleteDirectories || !patternCheck(filePath)) {
          walkSync(filePath)
          return
        }
        if (isGitTracked(filePath)) {
          log(`Skipping git-tracked directory: ${filePath}`)
          return
        }

        if (dry(`Would delete directory: ${filePath}`)) return
        try {
          log(`Deleting directory now: ${filePath}`)
          fs.rmSync(filePath, { recursive: true, force: true })
        } catch (err) {
          log(`Failed to delete directory: ${filePath}`, err)
        }
        return
      }

      if (!stat.isFile()) return

      if (!patternCheck(filePath)) return

      if (isGitTracked(filePath)) {
        log(`Skipping git-tracked file: ${filePath}`)
        return
      }

      if (dry(`Would delete: ${filePath}`)) return
      try {
        log(`Deleting now: ${filePath}`)
        fs.unlinkSync(filePath)
      } catch (err) {
        log(`Failed to delete file: ${filePath}`, err)
      }
    })
  }

  if (!deleteDirectories || !patternCheck(baseDir)) return walkSync(baseDir)
  if (dry(`Would delete directory: ${baseDir}`)) return
  try {
    log(`Deleting directory now: ${baseDir}`)
    fs.rmSync(baseDir, { recursive: true, force: true })
  } catch (err) {
    log(`Failed to delete directory: ${baseDir}`, err)
  }
}

function cleanGenerated() {
  config.SEARCH_DIRECTORIES.forEach((baseDir) => {
    if (fs.existsSync(baseDir)) {
      findAndDelete(baseDir, (filePath) =>
        config.GENERATED_PATTERNS.some((regex) => regex.test(filePath)),
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
      findAndDelete(
        item,
        (_) => true, // No specific pattern, delete all items in cache
        true, // Indicate that we are deleting directories
      )
    } else {
      log(`Skipping ${item}: directory does not exist`)
    }
  })
}

function cleanDist() {
  const baseDir = './'
  if (fs.existsSync(baseDir)) {
    findAndDelete(
      baseDir,
      (filePath) => path.basename(filePath) === 'dist',
      true, // Indicate that we are deleting directories
    )
  }
}

function cleanYarn() {
  if (fs.existsSync('.yarn')) {
    const r = new RegExp(
      `\\.yarn/(${config.CLEAN_YARN_IGNORES_LIST.join('|')})`,
    )
    findAndDelete(
      '.yarn',
      (filePath) => r.test(filePath),
      true, // Indicate that we are deleting directories
    )
  } else {
    log('No .yarn folder found')
  }
}

function cleanNodeModules() {
  const baseDir = './'
  findAndDelete(
    baseDir,
    (filePath) => path.basename(filePath) === 'node_modules',
    true, // Indicate that we are deleting directories
  )
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
    { name: 'dist directories', flag: config.CLEAN_DIST, func: cleanDist },
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
