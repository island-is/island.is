/**
 * Checks if user can run test-everything workflow.
 */

// @ts-check
import { exportVariable, setOutput, setFailed, info } from '@actions/core'
import { checkIfUserIsAdmin } from './_check_permission.mjs'
import { findLabelOwner, hasLabel, isPR } from './_pr_utils.mjs'

const TEST_EVERYTHING_LABEL = 'test everything'

if (!isPR) {
  info('This is not a pull request. Skipping check.')
  setTestEverything(false)
  process.exit(0)
}

const hasTestEverythingLabel = await hasLabel(TEST_EVERYTHING_LABEL)
if (!hasTestEverythingLabel) {
  info('The "test everything" label is not set. Skipping check.')
  setTestEverything(false)
  process.exit(0)
}

info('The "test everything" label is set. Proceeding with permission check.')
const labelOwner = await findLabelOwner(TEST_EVERYTHING_LABEL)
info(`The user that set the label ${TEST_EVERYTHING_LABEL} is ${labelOwner}.`)
const hasPermission = await checkIfUserIsAdmin(labelOwner)

if (hasPermission) {
  info(
    `User ${labelOwner} has sufficient permissions to set label: ${TEST_EVERYTHING_LABEL}`,
  )
  setTestEverything(true)
  process.exit(0)
}

setTestEverything(false)
setFailed(
  `User ${labelOwner} does not have sufficient permissions to set label: ${TEST_EVERYTHING_LABEL}.`,
)
process.exit(1)

/**
 * Sets the value of 'test_everything' output.
 * @param {boolean} value - The value to set. Should be a boolean.
 */
function setTestEverything(value = false) {
  setOutput('test-everything', value.toString())
  exportVariable('TEST_EVERYTHING', value.toString())
}
