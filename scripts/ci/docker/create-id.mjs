// @ts-check
// This is so every matrix has a unique ID which we can use when exporting values to output
// so we can be sure that output is not overwritten by another matrix job

import core from '@actions/core'
import { v5 as uuidv5 } from 'uuid'

const affectedProjects = process.env.AFFECTED_PROJECTS

if (!affectedProjects) {
  throw new Error('No affected projects found')
}

const id = uuidv5(affectedProjects, uuidv5.URL)

console.log(`Export Matrix ID: ${id}`)

core.exportVariable('MATRIX_ID', id)
core.exportVariable('UPLOAD_ARTIFACT_DOCKER', 'true')
