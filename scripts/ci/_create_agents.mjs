// @ts-check
import { getAffectedProjectsMultipleTargetArray, getShowAllProjects } from './_get_affected_projects.mjs'
import { setOutput } from '@actions/core'
import json2yaml from 'js-yaml'
const _TARGETS = ['test', 'build', 'lint']
const _PROBLEMATIC_TARGETS = [];

const _PROBLEMATIC_PROJECTS = [
  /* 'judicial-system-backend',
  'application-system-api',
  'services-auth-delegation-api',
  'services-auth-personal-representative',
  'services-auth-admin-api',
  'skilavottord-web', */
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
  const normalProjectsAndTargets = allAffectedTargets.filter((project) => !_PROBLEMATIC_PROJECTS.includes(project.split(':')[0]))
    .map(
      (project) => {
        return {
          project: project.split(':')[0],
          target: project.split(':')[1],
        }
      });
  const normalProjects = allAffectedTargets.filter(
    (project) => !_PROBLEMATIC_PROJECTS.includes(project.split(':')[0]),
  )
  const normalAgentCount = Math.min(Math.ceil(normalProjects.filter((e) => e.split(':') !== 'lint').length / JOBS_PER_AGENT), 5);
  const problematicAgentCount = problematicProjects.length
  const shouldRun = normalAgentCount + problematicAgentCount > 0

  const distributeRuleRunners = Array.from(new Set([
    ...problematicProjects.map((project) => project.replace(':', '-'))
      .flat()
  ])).map((e) => `1 ${e}`).join(' ');
  const rules = {
    'assignment-rules': [
      ...problematicProjects.map((project) => {
        return {
          project: project.split(':')[0],
          target: project.split(':')[1],
          configuration: 'production',
          'runs-on': [project.replace(':', '-')],
        }
      }),
      ...normalProjectsAndTargets.map(({ project, target }) => {
        return {
          project: project,
          target: target,
          configuration: 'production',
          'runs-on': ['default-runner'],
        }
      }),
    ],
  }
  const distributeOn = `${normalAgentCount} default-runner ${distributeRuleRunners}`;
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
    setOutput('NX_DISTRIBUTE_ON', distributeOn)
    setOutput('NX_CLOUD_DISTRIBUTED_EXECUTION_AGENT_COUNT', normalAgentCount);
    setOutput('NX_TARGETS', targets.join(','));
    setOutput('NX_RUN_ALL', getShowAllProjects() ? 'true' : 'false');
    setOutput('NX_BASE', process.env.NX_BASE ?? 'main');
    setOutput('NX_HEAD', process.env.NX_HEAD ?? 'HEAD');

  } else {
    setOutput('SHOULD_RUN_NX', 'false');
    setOutput('NX_RUNNERS', '[]');
  }
}

createAgents()
