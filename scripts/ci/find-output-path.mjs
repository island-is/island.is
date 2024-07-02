#!/usr/bin/env node
// @ts-check

import { spawn } from 'node:child_process'

const APP = process.argv[2]

const data = JSON.parse(await runCommand(`yarn nx show project ${APP}`))
const {
  targets: {
    build: { outputs, options },
  },
} = data

let output = outputs[0]
for (const [key, value] of Object.entries(options)) {
  output = output.replace(`{options.${key}}`, value)
}
console.log(output)

/**
 * Run command in a child process.
 * @param {string} cmd
 * @param {string | undefined} cwd
 */
export async function runCommand(cmd, cwd = undefined, env = {}) {
  return new Promise((resolve, reject) => {
    const options = cwd ? { cwd, encoding: 'utf-8' } : {}
    options.env = {
      ...process.env,
      ...env,
      NODE_OPTIONS: '--max-old-space-size=4096',
    }
    options.encoding = 'utf-8'

    const [command, ...args] = Array.isArray(cmd) ? cmd : cmd.split(' ')

    const childProcess = spawn(command, args, options)
    childProcess.stdout.setEncoding('utf-8')
    const errorChunks = []
    const outputChunks = []

    childProcess.stdout.on('data', (data) => {
      // console.log(data.toString())
      outputChunks.push(data.toString())
    })

    childProcess.stderr.on('data', (data) => {
      console.error(data.toString())
      errorChunks.push(data.toString())
    })

    childProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(errorChunks.join('\n'))
        console.error(`Failed to run command: ${cmd} returning code ${code}`)
        console.log(outputChunks.join('\n'))
        reject(`Error: Process exited with code ${code}`)
        return
      }
      resolve(outputChunks.join('\n'))
    })

    childProcess.on('error', (error) => {
      console.log(errorChunks.join('\n'))
      // reject(`Error: ${error.message}`)
    })
  })
}
