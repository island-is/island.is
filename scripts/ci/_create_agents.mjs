// @ts-check
import { getAffectedProjectsMultipleTargetArray, getShowAllProjects } from './_get_affected_projects.mjs'
import { setOutput } from '@actions/core'
import json2yaml from 'js-yaml'
const _TARGETS = ['test', 'build']
const _PROBLEMATIC_TARGETS = ['e2e']

const _PROBLEMATIC_PROJECTS = [
  'judicial-system-backend',
  'application-system-api',
  'services-auth-delegation-api',
  'services-auth-personal-representative',
  'services-auth-admin-api',
  'skilavottord-web',
]

const agent = 'arc-runners'

export const createAgents = ({ JOBS_PER_AGENT = 20 } = {}) => {
  const allAffectedTargets = getAffectedProjectsMultipleTargetArray(_TARGETS)
  const problematicProjects = [
    ...allAffectedTargets.filter((project) =>
      _PROBLEMATIC_PROJECTS.includes(project.split(':')[0]),
    ),
    ...getAffectedProjectsMultipleTargetArray(_PROBLEMATIC_TARGETS),
  ]
  const normalProjects = allAffectedTargets.filter(
    (project) => !_PROBLEMATIC_PROJECTS.includes(project.split(':')[0]),
  )
  const normalAgentCount = Math.ceil(normalProjects.length / JOBS_PER_AGENT)
  const problematicAgentCount = problematicProjects.length
  const shouldRun = normalAgentCount + problematicAgentCount > 0
  const rules = {
    'assignment-rules': [
      ...problematicProjects.map((project) => {
        return {
          project: project.split(':')[0],
          target: project.split(':')[1],
          'runs-on': [project.replace(':', '-')],
        }
      }),
      {
        configuration: 'production',
        'runs-on': ['default-runner'],
      },
    ],
  }

  const targets = [..._TARGETS, ..._PROBLEMATIC_TARGETS];

  const defaultRunners = Array(normalAgentCount)
    .fill(0)
    .map((_e, i) => `default-runner-${i + 1}`)
  const problematicRunners = Array.from(
    new Set([
      ...rules['assignment-rules']
        .map((rule) => `${rule['runs-on']}-1`)
        .flat()
        .filter((e) => !e.startsWith('default-runner')),
    ]),
  )
  const runners = [...defaultRunners, ...problematicRunners.map((e) => `${e}`)]
  const assignmentRules = json2yaml.dump(rules)
  console.log({
    defaultAgentCount: normalAgentCount,
    problematicAgentCount,
    runners,
    shouldRun,
  })
  if (shouldRun) {
    setOutput('SHOULD_RUN_NX', 'true')
    setOutput('NX_RUNNERS', JSON.stringify(runners))
    setOutput('NX_ASSIGNMENT_RULES', assignmentRules)
    setOutput('NX_TARGETS', targets.join(','));
    setOutput('NX_RUN_ALL', getShowAllProjects() ? 'true' : 'false');
  } else {
    setOutput('SHOULD_RUN_NX', 'false');
    setOutput('NX_RUNNERS', '[]');
  }
}

createAgents()
