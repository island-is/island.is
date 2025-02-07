// @ts-check
import { mkdirSync, writeFileSync } from 'fs'
import { getAffectedProjectsMultipleTargetArray } from './_get_affected_projects.mjs'
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
  const defaultRunners = Array(normalAgentCount)
    .fill(0)
    .map((_e, i) => `default-runner-${i + 1}`)
  const runners = Array.from(
    new Set([
      ...rules['assignment-rules']
        .map((rule) => rule['runs-on'])
        .flat()
        .filter((e) => e !== 'default-runner'),
      ...defaultRunners,
    ]),
  )
  const assignmentRules = json2yaml.dump(rules)
  const workflowJson = !shouldRun
    ? {
        jobs: {
          success: {
            name: 'Nothing to do',
            'runs-on': agent,
            steps: ['ecoh nothing to do. Exiting...'],
          },
        },
      }
    : {
        jobs: {
          nxtasks: {
            name: 'NX Tasks',
            'runs-on': agent,
            steps: ['echo hehe'],
          },
          ...runners.reduce((acc, item) => {
            const isDefaultRunner = item.startsWith('default-runner')
            acc[`runner-${item}`] = {
              name: item,
              'runs-on': agent,
              steps: [
                {
                  uses: 'actions/checkout@v4',
                  with: {
                    'fetch-depth': 0,
                  },
                },
                // TODO: Add steps needed hehe
                {
                  name: `${agent}`,
                  run: `yarn nx-cloud start-agent`,
                  env: {
                    NX_AGENT_NAME: isDefaultRunner
                      ? item.split('default-runner-')[1]
                      : '1',
                    NX_AGENT_LAUNCH_TEMPLATE: isDefaultRunner ? 'default-runner' : item,
                  },
                },
              ],
            }
            return acc
          }, {}),
        },
      }
  const workflow = json2yaml
    .dump(workflowJson)
    .replaceAll(/agents:\s*'\[.*?\]'/g, (match) => match.replace(/'/g, ''))
  if (!process.env.WORKFLOW_FILE) {
    console.error(`Workflow file env not defined`)
    process.exit(1)
  }
  mkdirSync(process.env.WORKFLOW_FILE, { recursive: true })
  writeFileSync(`${process.env.WORKFLOW_FILE}/action.yaml`, workflow)
  if (shouldRun) {
    writeFileSync('.github/assignment-rules.yml', assignmentRules)
  }
  console.log({
    defaultAgentCount: normalAgentCount,
    problematicAgentCount,
    runners,
    shouldRun,
  })
}

createAgents()
