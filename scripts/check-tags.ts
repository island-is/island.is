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
  const project = JSON.parse(projectText) as Project
  const tagsRaw = project.tags ?? []
  const tags = tagsRaw.map((tag) => tag.split(':'))
  // Only allow a single "scope:*" tag or a tuple of "scope:*" and "lib:*"
  const isNormal =
    (tags.length === 1 && tags[0][0] === 'scope') ||
    (tags.length === 2 &&
      tags.find(([key]) => key === 'scope' || key === 'lib') &&
      tags[0][1] === tags[1][1])
  const isEmpty = tags.length === 0

  if (isEmpty) {
    console.log(chalk.red.underline(filePath))
    console.log('Missing nx tags for project boundaries\n')
    return false
  } else if (!isNormal) {
    console.log(chalk.yellow.underline(filePath))
    console.log('Unexpected nx tags:', tagsRaw.join(','), '\n')
  }

  return true
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
    if (!(await hasValidTags(project).catch(() => false))) {
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
