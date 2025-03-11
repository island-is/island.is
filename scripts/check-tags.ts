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
  const validPrefix = tags.every(
    ([key]) =>
      key === 'scope' || key === 'lib' || key === 'TODO' || key === 'ci',
  )
  // Must have at least one scope tag or be empty
  const hasScopePrefix = tags.some(([key]) => key === 'scope') || isEmpty
  // Are all tags the same?
  const singularTag = new Set(tags.map(([, value]) => value)).size === 1
  // Is any tag repeaed?
  const repeatFreeTags = new Set(tagsRaw).size !== tagsRaw.length

  let isValid = true
  const messages = []
  messages.push(chalk.underline(filePath))
  if (isEmpty) {
    messages.push(chalk.red('- Missing NX tags for project boundaries'))
    isValid = false
  }
  if (!hasScopePrefix) {
    messages.push(chalk.red('- Missing scope tag'))
    isValid = false
  }
  if (!validPrefix) {
    messages.push(chalk.red('- Unexpected NX tags'))
    isValid = false
  }
  if (!singularTag) {
    messages.push(chalk.yellow('- All tags should be the same'))
    // Allow different tags for now (permitted according to docs)
    // isValid = false
  }
  if (repeatFreeTags) {
    messages.push(chalk.red("- Tags can't be repeated"))
    isValid = false
  }
  if (!isValid || messages.length > 1) {
    console.log(messages.join('\n'))
    console.log('NX tags:', tagsRaw, '\n')
  }

  return isValid
}

const checkProjects = async () => {
  const projects = globSync('{apps,libs}/**/project.json', {
    ignore: '**/node_modules/**',
  })
  let invalidProjects = []
  for (const project of projects) {
    if (!(await hasValidTags(project))) {
      invalidProjects.push(project)
    }
  }

  if (invalidProjects.length > 0) {
    console.log(chalk.red('Found errors in project files'))
    console.log(
      'All projects should have a configured NX tags which controls which project can import what.',
    )
    console.log(
      'For more information see: https://docs.devland.is/repository/nx-tags',
    )
    console.log('Invalid projects:', invalidProjects)
    process.exit(1)
  }
}

checkProjects()
