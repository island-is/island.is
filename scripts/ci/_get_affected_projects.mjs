// @ts-check
import { execSync } from 'child_process'

const IS_CI = process.env.CI === 'true'
const DEFAULT_TARGET = 'lint'

export const getShowAllProjects = () => {
  return (
    (process.env.BRANCH &&
      process.env.AFFECTED_ALL &&
      process.env.AFFECTED_ALL === `7913-${process.env.BRANCH}`) ||
    process.env.NX_AFFECTED_ALL === 'true' ||
    process.env.TEST_EVERYTHING === 'true'
  )
}

export const getDefault = () => {
  return {
    SHOW_ALL_PROJECTS: getShowAllProjects(),
    BASE: process.env.BASE ?? 'main',
    HEAD: process.env.HEAD ?? 'HEAD',
    MAX_RUNNERS: 3,
    TARGET: process.argv[2] ?? DEFAULT_TARGET,
  }
}

export const getAffectedProjectsArray = ({
  SHOW_ALL_PROJECTS = getShowAllProjects(),
  BASE = process.env.BASE ?? 'main',
  HEAD = process.env.HEAD ?? 'HEAD',
  TARGET = process.argv[2] ?? DEFAULT_TARGET,
} = {}) => {
  const EXTRA_ARGS = SHOW_ALL_PROJECTS
    ? []
    : ['--affected', '--base', BASE, '--head', HEAD]
  const COMMAND = `npx nx show projects --withTarget="${TARGET}" ${EXTRA_ARGS.join(
    ' ',
  )} --json`
  const OUTPUT = JSON.parse(execSync(COMMAND, { encoding: 'utf-8' }))
  return OUTPUT
}

export const getAffectedProjectsMultipleTargetArray = (targets = ['lint']) => {
  const projects = targets.map((target) =>
    getAffectedProjectsArray({ TARGET: target }).map((e) => `${e}:${target}`),
  )
  return Array.from(new Set(projects.flat()))
}

export const getAffectedProjectsString = (props = {}) => {
  const projects = getAffectedProjectsArray(props)
  if (projects.length === 0) {
    return null
  }
  return projects.join(',')
}

export const runLinterAffectedProjects = (_props = {}) => {
  const props = { ...getDefault(), ..._props }
  console.log({ props })
  if (props.SHOW_ALL_PROJECTS) {
    console.log(`Running all projects for ${props.TARGET ?? DEFAULT_TARGET}`)
    execSync(
      `npx nx run-many --parallel=${props.MAX_RUNNERS} --target=${
        props.TARGET ?? DEFAULT_TARGET
      } --all`,
      {
        encoding: 'utf-8',
        stdio: 'inherit',
      },
    )
    return
  }
  console.log(`Running ${props.TARGET ?? DEFAULT_TARGET} on affected projects`)
  execSync(
    `npx nx affected --parallel=${props.MAX_RUNNERS} --target=${
      props.TARGET ?? DEFAULT_TARGET
    } --base=${props.BASE} --head=${props.HEAD}`,
    {
      encoding: 'utf-8',
      stdio: 'inherit',
    },
  )
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (IS_CI) {
    runLinterAffectedProjects()
  } else {
    console.log(getAffectedProjectsArray())
  }
}
