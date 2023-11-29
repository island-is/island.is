/**
 * To run: yarn ts scripts/check-tags.ts
 */
import { readFile } from 'fs/promises'
import { globSync } from 'glob'
import chalk from 'chalk'

interface Project {
  tags: string[]
}

const checkTags = async (filePath: string) => {
  const projectText = await readFile(filePath, 'utf8')
  const project = JSON.parse(projectText) as Project
  const tagsRaw = project.tags ?? []
  const tags = tagsRaw.map((tag) => tag.split(':'))
  const isNormal =
    (tags.length === 1 && tags[0][0] === 'scope') ||
    (tags.length === 2 &&
      tags.find(([key]) => key === 'scope') &&
      tags.find(([key]) => key === 'lib') &&
      tags[0][1] === tags[0][1])
  const isEmpty = tags.length === 0

  if (isEmpty) {
    console.log(chalk.red.underline(filePath))
    console.log('Missing nx tags for project boundaries\n')
    return true
  } else if (!isNormal) {
    console.log(chalk.yellow.underline(filePath))
    console.log('Unexpected nx tags:', tagsRaw.join(','), '\n')
  }

  return false
}

const checkProjects = async () => {
  const projects = globSync('{apps,libs}/**/project.json', {
    ignore: '**/node_modules/**',
  })
  let hasError = false
  for (const project of projects) {
    hasError = hasError || (await checkTags(project))
  }

  if (hasError) {
    console.log(chalk.red('Found errors'))
    console.log(
      'All projects should have a configured NX tags which controls which project can import what. For more information see: https://docs.devland.is/repository/nx-tags',
    )
    process.exit(1)
  }
}

checkProjects()
