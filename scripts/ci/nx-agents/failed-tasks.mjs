// @ts-check
/**
 * Prints the failed tasks (`project:target`) in the output of an Nx command as a JSON list.
 *
 * Usage: node scripts/ci/nx-agents/failed-tasks.mjs <file with the output of nx>
 */
import { readFileSync } from 'fs'

const MAX_TASKS = 50
const TASK_ID = '[\\w@./-]+(?::[\\w@./-]+)+'

const output = readFileSync(process.argv[2], 'utf-8').replace(
  // eslint-disable-next-line no-control-regex
  /\x1b\[[0-9;]*[A-Za-z]/g,
  '',
)

/** @type {Set<string>} */
const failed = new Set()

// Rows of the task table of a distributed run, `│ ✔ Completed │ web:build │ 8s │ Cache Miss │`
const tableRow = new RegExp(`^│\\s*(\\S.*?)\\s*│\\s*(${TASK_ID}…?)\\s*│`)
// The list after "Failed tasks:" of a run without agents, `- web:build`
const listItem = new RegExp(`^\\s*- (${TASK_ID})\\s*$`)
let inFailedList = false
for (const line of output.split('\n')) {
  const row = line.match(tableRow)
  if (row && !/completed|cache/i.test(row[1])) {
    failed.add(row[2])
  }
  if (/^\s*Failed tasks:/.test(line)) {
    inFailedList = true
  } else if (inFailedList && line.trim() !== '') {
    const item = line.match(listItem)
    if (item) failed.add(item[1])
    else inFailedList = false
  }
}

// In case the output has neither: jest says which project a failed test file is of,
// ` FAIL   services-user-notification  apps/services/user-notification/src/...spec.ts`
for (const match of output.matchAll(
  /^\s*FAIL\s+([\w@.-]+)\s+\S+\.(?:spec|test)\.[jt]sx?/gm,
)) {
  if (![...failed].some((task) => task.startsWith(`${match[1]}:test`))) {
    failed.add(`${match[1]}:test`)
  }
}

// The table cuts long task ids short (`judicial-system-digital-mailbox-api:b…`).
// The output of a failed task starts with `> nx run <task id>`, which has all of it
const taskIds = [
  ...new Set(
    [...output.matchAll(new RegExp(`^> nx run (${TASK_ID})`, 'gm'))].map(
      (match) => match[1],
    ),
  ),
]
const tasks = [...failed].map((task) => {
  if (!task.endsWith('…')) return task
  const matches = taskIds.filter((id) => id.startsWith(task.slice(0, -1)))
  return matches.length === 1 ? matches[0] : task
})

console.log(JSON.stringify([...new Set(tasks)].sort().slice(0, MAX_TASKS)))
