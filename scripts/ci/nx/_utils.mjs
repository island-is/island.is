// @ts-check

import { exec } from 'child_process'
import { stat } from 'fs/promises'

export function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(`Error: ${error.message}`)
        return
      }
      resolve(void 0)
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
    