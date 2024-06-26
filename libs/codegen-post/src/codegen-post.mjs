// @ts-check
import { IGNORE_PROJECTS, PROJECTJSON } from './const.mjs'
import { readFile } from 'fs/promises'
import { getProjectList } from './get-list.mjs'

const projectJSON = JSON.parse(await readFile(PROJECTJSON, 'utf-8'))
const currentProjects = await getProjectList()

const definedProjects = (projectJSON.implicitDependencies ?? []).filter(
  (e) => e != 'codegen-post',
)
const missingProjects = currentProjects.filter(
  (project) =>
    !IGNORE_PROJECTS.includes(project) && !definedProjects.includes(project),
)

if (missingProjects.length) {
  console.error(`Missing projects in project.json`)
  missingProjects.forEach((project) => console.error(`"${project}",\n`))
  process.exit(1)
}

console.log('Ready to run frontend client.')
