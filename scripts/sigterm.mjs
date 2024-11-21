#!/usr/bin/env node
// @ts-check

import { execSync, spawn } from 'child_process'
import { createLogger, format, transports } from 'winston'
import fetch from 'node-fetch'

// Winston Logger Configuration
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} - ${level.toUpperCase()}: ${message}`,
    ),
  ),
  transports: [new transports.Console()],
})

// Configurable Variables
const CHECK_INTERVAL = parseFloat(process.env.CHECK_INTERVAL || '0.2') // in seconds
const CHECK_TIMEOUT = parseInt(process.env.CHECK_TIMEOUT || '30') // in seconds
const CHECK_ENDPOINT = process.env.CHECK_ENDPOINT || 'readiness'
const PORT = parseInt(process.env.PORT || '4200')
const SLEEP_TIME = parseInt(process.env.SLEEP_TIME || '5') // in seconds

// Helper Function to Execute Shell Commands
/**
 * Performs a dry run if configured.
 * @param {string} command - The command to execute.
 * @returns {string} - Returns the output of the command.
 */
const execCommand = (command) => {
  try {
    return execSync(command, { encoding: 'utf8' }).trim()
  } catch (error) {
    logger.error(`Command failed: ${command}\n${error.message}`)
    throw error
  }
}

// Main Script
;(async () => {
  const appName = process.argv[2]
  if (!appName) {
    logger.error('Usage: node script.mjs <APP>')
    process.exit(1)
  }

  logger.info(`Retrieving project directory for app '${appName}'...`)
  let projectDir
  try {
    const nxOutput = execCommand(`npx nx show project ${appName}`)
    projectDir = JSON.parse(nxOutput).root
    if (!projectDir) {
      throw new Error('Project directory not found in Nx output.')
    }
  } catch (error) {
    logger.error(`Failed to retrieve project directory: ${error.message}`)
    process.exit(1)
  }

  const distPath = `dist/${projectDir}`
  logger.info(`Building app '${appName}'...`)
  try {
    execCommand(`yarn build ${appName}`)
  } catch (error) {
    logger.error(`Build failed: ${error.message}`)
    process.exit(1)
  }

  logger.info('Starting app...')
  const appProcess = spawn('node', ['main'], {
    cwd: distPath,
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit',
  })
  const appPid = appProcess.pid
  if (!appPid) {
    logger.error('Failed to start app.')
    process.exit(1)
  }
  logger.info(`App started with PID: ${appPid}`)

  logger.info(
    `Waiting for app readiness at http://localhost:${PORT}/${CHECK_ENDPOINT}...`,
  )
  const startTime = Date.now()
  let ready = false

  while (!ready) {
    if ((Date.now() - startTime) / 1000 > CHECK_TIMEOUT) {
      logger.error(`Readiness check timed out after ${CHECK_TIMEOUT} seconds.`)
      process.kill(appPid, 'SIGTERM')
      process.exit(1)
    }
    try {
      const response = await fetch(`http://localhost:${PORT}/${CHECK_ENDPOINT}`)
      const text = await response.text()
      if (text.includes('ready')) {
        ready = true
      }
    } catch (error) {
      // No action needed; app might not be ready yet
    }
    if (!ready)
      await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL * 1000))
  }

  logger.info('App is ready.')
  logger.info(
    `Sleeping for ${SLEEP_TIME} seconds to allow full initialization...`,
  )
  await new Promise((resolve) => setTimeout(resolve, SLEEP_TIME * 1000))

  logger.info('Sending SIGTERM to the app...')
  process.kill(appPid, 'SIGTERM')

  try {
    await new Promise((resolve, reject) => {
      appProcess.on('close', resolve)
      appProcess.on('error', reject)
    })
    logger.info('App terminated successfully.')
  } catch (error) {
    logger.error(`App did not terminate cleanly: ${error.message}`)
  }
})()
