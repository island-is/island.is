// @ts-check
import { exportVariable, setOutput, summary } from '@actions/core'
import { ENV_KEYS } from './_const.mjs'

const SUMMARY_TITLE = `Cache keys`

export async function writeToSummary(
  hashes,
  enabled = !!process.env.GITHUB_STEP_SUMMARY,
) {
  if (!enabled) {
    return
  }
  summary.addHeading(SUMMARY_TITLE)
  summary.addTable([
    [
      { data: 'Key', header: true },
      { data: 'Hash', header: true },
    ],
    ...Object.entries(hashes).map(([key, value]) => [key, value]),
  ])
}

export async function writeToOutput(
  hashes,
  enabled = !!process.env.GITHUB_OUTPUT,
  file = process.env.GITHUB_OUTPUT ?? '',
) {
  if (!enabled) {
    return
  }
  exportVariable(ENV_KEYS, JSON.stringify(hashes))
  setOutput(ENV_KEYS, JSON.stringify(hashes))
}
