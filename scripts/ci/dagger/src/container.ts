import {
  dag,
  Container,
  Directory,
  object,
  func,
  DirectoryFilterOpts,
} from '@dagger.io/dagger'
import {
  DEFAULT_PLATFORM,
  FILE_SETTINGS,
  GITHUB_URL,
  RUNNER_IMAGE,
  WORKDIR,
} from './const'
import type {
  AWSProps,
  FILE_ACTION_GITHUB_BRANCH,
  FILE_ACTION_GITHUB_SHA,
  FILE_ACTION_LOCAL,
  NXProps,
} from './interface'

const MONO_REPO_FILTERS = {
  include: [
    'package.json',
    '**/package.json',
    'yarn.lock',
    '.yarn/patches/*',
    '.yarn/releases/*',
    '.yarnrc.yml',
  ],
}

export async function getMonorepoBase(props: MonorepoBase) {
  const container = await getMonorepoNodemodules({
    ...props,
  })
  const files = getMonorepoBaseFiles(props)
  let newContainer = container
    .withDirectory(WORKDIR, files, FILE_SETTINGS)
    .withWorkdir(WORKDIR)
  if (props.NX_CLOUD_ACCESS_TOKEN) {
    newContainer = newContainer
      .withSecretVariable('NX_CLOUD_ACCESS_TOKEN', props.NX_CLOUD_ACCESS_TOKEN)
      .withEnvVariable('NX_TASKS_RUNNER', 'ci')
  }
  return newContainer.withExec(['yarn', 'codegen']).sync()
}

async function getMonorepoNodemodules(props: MonorepoBase) {
  const container = getEcrContainer({
    ...props,
    image: RUNNER_IMAGE,
  })
  const files = getMonorepoInstallFiles(props)
  return container
    .withDirectory(WORKDIR, files, FILE_SETTINGS)
    .withWorkdir(WORKDIR)
    .withExec(['corepack', 'enable'])
    .withExec(['yarn', 'install', '--immutable'])
    .sync()
}

export type MonorepoBase = MonorepoContainer & AWSProps & NXProps

interface MonorepoContainerGithubSha {
  action: FILE_ACTION_GITHUB_SHA
  sha: string
}

interface MonorepoContainerGithubBranch {
  action: FILE_ACTION_GITHUB_BRANCH
  branch: string
}

interface MonorepoContainerLocal {
  action: FILE_ACTION_LOCAL
  files: Directory
}

type MonorepoContainer =
  | MonorepoContainerGithubSha
  | MonorepoContainerLocal
  | MonorepoContainerGithubBranch

function getEcrContainer(props: MonorepoBase & { image: string }) {
  const ecrHost = props.image.split('/')[0]
  const platform = DEFAULT_PLATFORM
  return dag
    .container({ platform })
    .withRegistryAuth(ecrHost, 'AWS', props.AWS_ECR_PASSWORD)
    .from(props.image)
}

function getMonorepoInstallFiles(props: MonorepoContainer) {
  const tree = (() => {
    if (props.action === 'sha') {
      console.log(`Fetching files from sha: ${props.sha}`)
      return dag.git(GITHUB_URL).commit(props.sha).tree()
    }
    if (props.action === 'branch') {
      console.log(`Fetching files from branch: ${props.branch}`)
      return dag.git(GITHUB_URL).branch(props.branch).tree()
    }
    if (props.action === 'local') {
      console.log(`Fetching files from local`)
      return props.files
    }
  })().filter(MONO_REPO_FILTERS)
  return tree
}

function getMonorepoBaseFiles(props: MonorepoContainer) {
  const tree = (() => {
    if (props.action === 'sha') {
      console.log(`Fetching files from sha: ${props.sha}`)
      return dag.git(GITHUB_URL).commit(props.sha).tree()
    }
    if (props.action === 'branch') {
      console.log(`Fetching files from branch: ${props.branch}`)
      return dag.git(GITHUB_URL).branch(props.branch).tree()
    }
    if (props.action === 'local') {
      console.log(`Fetching files from local`)
      return props.files
    }
  })()
  return tree
}
