#!/usr/bin/env node

import { execSync } from 'child_process'
import { setTimeout } from 'timers/promises'

const MAX_ATTEMPTS = process.env.MAX_ATTEMPTS || 5
const WAIT_TIME_SECONDS = process.env.WAIT_TIME_SECONDS || 300
const DOCKER_TYPE = process.env.DOCKER_TYPE
const NODE_IMAGE_VERSION = process.env.NODE_IMAGE_VERSION

/**
 * Executes a shell command and returns the output
 * @param {string} command - The command to execute
 * @param {boolean} printOutput - Whether to print the command output to console
 * @returns {Object} Object containing success status and output
 */
function executeCommand(command, printOutput = true) {
  console.log(`Executing: ${command}`)

  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: printOutput ? 'inherit' : 'pipe',
    })
    return { success: true, output }
  } catch (error) {
    console.error(`Command failed with exit code: ${error.status}`)
    return { success: false, output: error.message }
  }
}

async function runDockerBuildWithRetry() {
  if (!DOCKER_TYPE) {
    console.error('DOCKER_TYPE environment variable is required')
    process.exit(1)
  }

  console.log('=== Docker Build With Retry ===')
  console.log(`Maximum attempts: ${MAX_ATTEMPTS}`)
  console.log(`Wait time between retries: ${WAIT_TIME_SECONDS} seconds`)
  console.log(`Node image tag: ${NODE_IMAGE_VERSION || 'not set'}`)
  console.log(`Docker build args: ${EXTRA_DOCKER_BUILD_ARGS || 'not set'}`)

  for (let attemptCount = 1; attemptCount <= MAX_ATTEMPTS; attemptCount++) {
    console.log(`\n----- Attempt ${attemptCount} of ${MAX_ATTEMPTS} -----`)

    const result = executeCommand(
      `./scripts/ci/run-in-parallel.sh "90_${DOCKER_TYPE}"`,
    )
    const success = result.success

    if (success) {
      console.log(`\n✅ Docker build succeeded on attempt ${attemptCount}`)
      process.exit(0)
    } else {
      console.log(`\n❌ Docker build failed on attempt ${attemptCount}`)

      if (attemptCount < MAX_ATTEMPTS) {
        console.log(
          `Waiting for ${WAIT_TIME_SECONDS} seconds before next attempt...`,
        )
        await setTimeout(WAIT_TIME_SECONDS * 1000)
      } else {
        console.log(`All ${MAX_ATTEMPTS} attempts failed.`)
      }
    }
  }

  process.exit(1)
}

runDockerBuildWithRetry()
