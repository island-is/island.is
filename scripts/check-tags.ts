/**
 * To run: yarn ts scripts/check-tags.ts
 */
import { readFile } from 'fs/promises'
import { globSync } from 'glob'
import chalk from 'chalk'

interface Project {
  tags: string[]
}

const hasValidTags = async (filePath: string) => {
  const projectText = await readFile(filePath, 'utf8')
  let parsedText
  try {
    parsedText = JSON.parse(projectText)
  } catch (e) {
    console.error('Invalid JSON', e)
    return false
  }
  const project: Project = parsedText

  const tagsRaw = project.tags ?? []
  const tags = tagsRaw.map((tag) => tag.split(':'))

  const isEmpty = tags.length === 0
  // Only allow 'scope:*' or 'lib:*' tags
  const validPrefix = tags.every(([key]) => key === 'scope' || key === 'lib')
  // Must have at least one scope tag or be empty
  const hasScopePrefix = tags.some(([key]) => key === 'scope') || isEmpty
  // Are all tags the same?
  const singularTag = new Set(tags.map(([, value]) => value)).size === 1
  // Is any tag repeaed?
  const repeatFreeTags = new Set(tagsRaw).size !== tagsRaw.length

  // Exit early for good projects
  if (
    !isEmpty &&
    validPrefix &&
    hasScopePrefix &&
    singularTag &&
    !repeatFreeTags
  ) {
    return true
  }
  console.log(chalk.red.underline(filePath))
  if (isEmpty) {
    console.log('- Missing NX tags for project boundaries')
  }
  if (!hasScopePrefix) {
    console.log('- Missing scope tag')
  }
  if (!validPrefix) {
    console.log('- Unexpected NX tags')
  }
  if (!singularTag) {
    console.log('- All tags must be the same')
  }
  if (repeatFreeTags) {
    console.log("- Tags can't be repeated")
  }
  console.log('NX tags:', tagsRaw, '\n')

  return false
}

const checkProjects = async () => {
  const projects = globSync('{apps,libs}/**/project.json', {
    ignore: '**/node_modules/**',
  })
  let invalidProjects = []
  for (const project of projects) {
    // console.log("Checking project", project)
    // Old
    // hasError = hasError || (await checkTags(project))

    // New, and faster
    if (!(await hasValidTags(project))) {
      invalidProjects.push(project)
    }
  }

  if (invalidProjects.length > 0) {
    console.log(chalk.red('Found errors in project files'))
    console.log(
      'All projects should have a configured NX tags which controls which project can import what. For more information see: https://docs.devland.is/repository/nx-tags',
    )
    console.log('Invalid projects:', invalidProjects)
    process.exit(1)
  }
}

checkProjects()
