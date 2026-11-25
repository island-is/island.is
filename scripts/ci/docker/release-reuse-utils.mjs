// @ts-check

export const DOCKER_TARGETS = {
  'docker-express': 'output-express',
  'docker-express-yarn': 'output-express-yarn',
  'docker-jest': 'output-jest',
  'docker-next': 'output-next',
  'docker-playwright': 'output-playwright',
  'docker-static': 'output-static',
}

export function getReleaseVersion(branch) {
  return branch?.startsWith('release/') ? branch.slice('release/'.length) : ''
}

export function normalizePushBranchTag(branch) {
  return branch.slice(0, 45).replace(/[/.]/g, '-')
}

export function getPreReleaseTagPrefix(branch) {
  return `${normalizePushBranchTag(getPreReleaseBranch(branch))}_`
}

export function getPreReleaseBranch(branch) {
  return `pre-release/${getReleaseVersion(branch)}`
}

// Mirrors the docker tag generated for pre-release pushes in push.yml
export function getPreReleaseImageTag(
  branch,
  sha,
  runNumber,
  tagPrefix = getPreReleaseTagPrefix(branch),
) {
  return `${tagPrefix}${sha.slice(0, 10)}_${runNumber}`
}

export function chunkToBuildMatrix(chunks) {
  return JSON.stringify(chunks.map((chunk) => JSON.stringify(chunk)))
}

export function getSingleProject(chunk) {
  const projects = String(chunk.projects ?? '')
    .split(',')
    .map((project) => project.trim())
    .filter(Boolean)

  return projects.length === 1 ? projects[0] : undefined
}

export function buildImageData(chunk, imageTag, sourceTag) {
  const project = getSingleProject(chunk)
  if (!project) {
    throw new Error(`Expected exactly one project in chunk: ${chunk.projects}`)
  }

  return {
    value: 'build',
    project,
    target: DOCKER_TARGETS[chunk.docker_type] ?? chunk.docker_type,
    imageName: project,
    imageTag,
    // Only for traceability, get-data.mjs does not read it
    ...(sourceTag && { sourceTag }),
  }
}
