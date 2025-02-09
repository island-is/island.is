#!/usr/bin/env node

import { execSync } from 'child_process'

// Function to run shell commands
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim()
  } catch (error) {
    console.error(`Error executing command: ${command}`)
    console.error(error.message)
    return null
  }
}

// Get BUILD_CHUNKS from command-line argument
const BUILD_CHUNKS = process.argv[2]

if (!BUILD_CHUNKS) {
  console.error(
    'Please provide the BUILD_CHUNKS string as a command-line argument',
  )
  console.error(
    'Usage: node transform_build_chunks.mjs "<BUILD_CHUNKS_STRING>"',
  )
  process.exit(1)
}

// Parse BUILD_CHUNKS
let chunks
try {
  chunks = JSON.parse(BUILD_CHUNKS)
} catch (error) {
  console.error('Failed to parse BUILD_CHUNKS as JSON')
  console.error(error.message)
  process.exit(1)
}

// Process each chunk
const result = chunks.flatMap((chunk, index) => {
  // Check if chunk is a string (it might be pre-stringified JSON)
  if (typeof chunk === 'string') {
    try {
      chunk = JSON.parse(chunk)
    } catch (error) {
      console.error(`Failed to parse chunk at index ${index}:`, chunk)
      console.error(error.message)
      return []
    }
  }

  // Check if chunk has 'projects' and 'docker_type' properties
  if (!chunk.projects || !chunk.docker_type) {
    console.error(
      `Chunk at index ${index} is missing 'projects' or 'docker_type' property:`,
      chunk,
    )
    return []
  }

  const projects = chunk.projects.split(',')
  return projects.map((project) => {
    const homeCommand = `yarn nx show project "${project}" | jq ".root" -r`
    const home = runCommand(homeCommand)
    return { project, home, docker_type: chunk.docker_type }
  })
})

// Output the final JSON string, escaped for GitHub Actions
console.log(JSON.stringify(result).replace(/"/g, '\\"'))
