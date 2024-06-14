// @ts-check

import { exec } from 'child_process'
import { stat } from 'fs/promises'
import { spawn } from 'child_process'

export function runCommand(command) {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(command, { shell: true, stdio: 'inherit' })
        if (childProcess.stdout) {
            childProcess.stdout.setEncoding('utf-8')
        }
        childProcess.on('exit', (code) => {
            if (code === 0) {
                resolve(void 0)
            } else {
                reject(`Command failed with exit code ${code}`)
            }
        })
    })
}

export function runNxCommand(command) {
  return runCommand(`yarn nx ${command}`)
}

export function runNxCloudCommand(command) {
  return runCommand(`yarn nx-cloud ${command}`)
}

export function runNxAffected(target) {
  if (!target) {
    throw new Error('target is required')
  }
  const targetStr = Array.isArray(target) ? target.join(',') : target
  return runNxCommand(`affected --target=${targetStr}`)
}

export function hasGitChanges() {
  const command = `git diff --stat `
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(`Error: ${error.message}`)
        return
      }
      resolve(stdout.trim() !== '')
    })
  })
}

export async function fileExists(path) {
  return !!(await stat(path).catch((_) => false))
}
