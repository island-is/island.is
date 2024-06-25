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

  for (const arg of args) {
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
        break
      default:
        showHelp()
        process.exit(1)
    }
  }

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

function cleanGenerated() {
  const patterns = [
    'openapi.yaml',
    'api.graphql',
    'schema.d.ts',
    'schema.tsx',
    'schema.ts',
    'gen/graphql.ts',
    '*.generated.ts',
    'possibleTypes.json',
    'fragmentTypes.json',
  ]

  function findFiles(baseDir, pattern) {
    const regex = new RegExp('/' + pattern.replace(/\*/g, '.*'))
    const results = []
    function walkSync(currentDirPath) {
      if (currentDirPath.includes('node_modules')) {
        return
      }
      fs.readdirSync(currentDirPath).forEach((name) => {
        const filePath = path.join(currentDirPath, name)
        const stat = fs.statSync(filePath)
        if (stat.isFile() && regex.test(filePath)) {
          results.push(filePath)
        } else if (stat.isDirectory()) {
          walkSync(filePath)
        }
      })
    }
    walkSync(baseDir)
    return results
  }

  ;['apps', 'libs'].forEach((baseDir) => {
    patterns.forEach((pattern) => {
      findFiles(baseDir, pattern).forEach((file) => {
        if (!isGitTracked(file)) {
          if (dry(`Would delete: ${file}`)) {
            log(`Would delete: ${file}`)
          } else {
            log(`Deleting now: ${file}`)
            fs.unlinkSync(file)
          }
        } else {
          log(`Skipping git-tracked file: ${file}`)
        }
      })
    })
  })

  const dirsToDelete = 'gen/fetch'
  function findDirsToDelete(baseDir) {
    fs.readdirSync(baseDir).forEach((name) => {
      const dirPath = path.join(baseDir, name)
      const stat = fs.statSync(dirPath)
      if (dirPath.includes('node_modules')) {
        return
      }
      if (stat.isDirectory() && dirPath.includes(dirsToDelete)) {
        if (dry(`Would delete directory: ${dirPath}`)) {
          log(`Would delete directory: ${dirPath}`)
        } else {
          log(`Deleting directory now: ${dirPath}`)
          fs.rmdirSync(dirPath, { recursive: true })
        }
      } else if (stat.isDirectory()) {
        findDirsToDelete(dirPath)
      }
    })
  }

  ;['apps', 'libs'].forEach((baseDir) => findDirsToDelete(baseDir))
}

function cleanCaches() {
  config.CLEAN_CACHES_LIST.forEach((item) => {
    if (dry(`Would delete: ${item}`)) {
      log(`Would delete: ${item}`)
    } else {
      log(`Deleting now: ${item}`)
      fs.rmdirSync(item, { recursive: true })
    }
  })
}

function cleanYarn() {
  if (!fs.existsSync('.yarn')) {
    log('No .yarn folder')
    return
  }

  fs.readdirSync('.yarn').forEach((item) => {
    if (!config.CLEAN_YARN_IGNORES_LIST.includes(item)) {
      const fullPath = path.join('.yarn', item)
      if (dry(`Would delete: ${fullPath}`)) {
        log(`Would delete: ${fullPath}`)
      } else {
        log(`Deleting now: ${fullPath}`)
        fs.rmdirSync(fullPath, { recursive: true })
      }
    }
  })
}

function cleanNodeModules() {
  function findAndDeleteNodeModules(baseDir) {
    fs.readdirSync(baseDir).forEach((name) => {
      const dirPath = path.join(baseDir, name)
      const stat = fs.statSync(dirPath)

      if (stat.isDirectory()) {
        if (name === 'node_modules') {
          if (dry(`Would delete: ${dirPath}`)) {
            log(`Would delete: ${dirPath}`)
          } else {
            log(`Deleting now: ${dirPath}`)
            fs.rmSync(dirPath, { recursive: true, force: true })
          }
        } else {
          findAndDeleteNodeModules(dirPath) // Recursively search subdirectories
        }
      }
    })
  }

  // Check root node_modules
  if (fs.existsSync('node_modules')) {
    if (dry('Would delete: node_modules')) {
      log('Would delete: node_modules')
    } else {
      log('Deleting now: node_modules')
      fs.rmSync('node_modules', { recursive: true, force: true })
    }
  } else {
    log('Skipping root node_modules: directory does not exist')
  }

  // Check node_modules in apps and libs directories
  ;['apps', 'libs'].forEach((baseDir) => {
    if (fs.existsSync(baseDir)) {
      findAndDeleteNodeModules(baseDir)
    }
  })
}

function cleanAll() {
  if (config.CLEAN_GENERATED) {
    log('Cleaning generated files')
    cleanGenerated()
  } else {
    log('Skipping generated files')
  }

  if (config.CLEAN_CACHES) {
    log('Cleaning cache files')
    cleanCaches()
  } else {
    log('Skipping cache files')
  }

  if (config.CLEAN_YARN) {
    log('Cleaning yarn files')
    cleanYarn()
  } else {
    log('Skipping yarn files')
  }

  if (config.CLEAN_NODE_MODULES) {
    log('Cleaning node_modules')
    cleanNodeModules()
  } else {
    log('Skipping node_modules')
  }
}

parseArgs(process.argv.slice(2))
cleanAll()
