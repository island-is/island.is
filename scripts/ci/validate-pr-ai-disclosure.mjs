#!/usr/bin/env node
// @ts-check

const NO_AI_LABEL = 'No AI tools were used in preparing this pull request'
const AI_USED_LABEL = 'AI tools were used in preparing this pull request'
const TOOLS_USED_LABEL = 'Tools used:'

/**
 * @typedef {{
 *   found: boolean
 *   checked: boolean
 * }} CheckboxState
 */

/**
 * Escapes a string for use in a regular expression.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Finds a checkbox line by its exact label and returns whether it exists and is checked.
 *
 * @param {string[]} lines
 * @param {string} label
 * @returns {CheckboxState}
 */
function findCheckboxState(lines, label) {
  const pattern = new RegExp(
    `^\\s*[-*]\\s*\\[([ xX])]\\s+${escapeRegExp(label)}\\s*$`,
  )

  for (const line of lines) {
    const match = line.match(pattern)
    if (match) {
      return {
        found: true,
        checked: match[1].toLowerCase() === 'x',
      }
    }
  }

  return { found: false, checked: false }
}

/**
 * Checks whether the PR body contains a non-empty tools declaration.
 * Accepts either same-line content after `Tools used:` or content on
 * immediately following indented lines.
 *
 * @param {string[]} lines
 * @returns {boolean}
 */
function hasDefinedTools(lines) {
  const pattern = new RegExp(`^\\s*${escapeRegExp(TOOLS_USED_LABEL)}(.*)$`)

  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(pattern)
    if (!match) {
      continue
    }

    if (match[1].trim().length > 0) {
      return true
    }

    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex++) {
      const nextLine = lines[nextIndex]

      if (nextLine.trim() === '') {
        break
      }

      if (!/^[ \t]+/.test(nextLine)) {
        break
      }

      if (nextLine.trim().length > 0) {
        return true
      }
    }

    return false
  }

  return false
}

/**
 * Validates AI disclosure requirements in the PR body.
 *
 * @param {string} body
 * @returns {string[]} Validation errors. Empty when valid.
 */
function validatePrBody(body) {
  const normalizedBody = body.replace(/\r\n/g, '\n')
  const lines = normalizedBody.split('\n')
  const errors = []

  const noAi = findCheckboxState(lines, NO_AI_LABEL)
  const aiUsed = findCheckboxState(lines, AI_USED_LABEL)

  if (!noAi.found) {
    errors.push(`Missing checkbox: "${NO_AI_LABEL}"`)
  }

  if (!aiUsed.found) {
    errors.push(`Missing checkbox: "${AI_USED_LABEL}"`)
  }

  if (errors.length > 0) {
    return errors
  }

  if (!noAi.checked && !aiUsed.checked) {
    errors.push(
      'Choose exactly one AI disclosure checkbox: either no AI tools were used or AI tools were used.',
    )
  }

  if (noAi.checked && aiUsed.checked) {
    errors.push(
      'AI disclosure checkboxes are mutually exclusive. Uncheck one of them before requesting review.',
    )
  }

  if (aiUsed.checked && !hasDefinedTools(lines)) {
    errors.push(
      'When "AI tools were used in preparing this pull request" is checked, add a non-empty value after "Tools used:".',
    )
  }

  return errors
}

/**
 * Runs the validator using the PR body provided by the workflow.
 */
function main() {
  if (!Object.prototype.hasOwnProperty.call(process.env, 'PR_BODY')) {
    console.error(
      'PR_BODY environment variable is not set. The workflow must pass the pull request body to this script.',
    )
    process.exit(1)
  }

  const errors = validatePrBody(process.env.PR_BODY ?? '')

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  console.log('AI disclosure in the pull request body is valid.')
}

main()
