#!/usr/bin/env node
import { getPackageJSON } from './_common.mjs'

const DOCKERHUB_BASE_URL =
  'https://hub.docker.com/v2/repositories/library/node/tags?page_size=100'

const nodeVersion = await getPackageVersion()
const version = await getVersion(nodeVersion)

if (!version) {
  console.error(`Failed getting docker image for ${nodeVersion}`)
  process.exit(1)
}
process.stdout.write(version)

async function getVersion(
  version,
  withAlpine = true,
  architecture = 'amd64',
  url = null,
) {
  try {
    const baseURL = url ?? DOCKERHUB_BASE_URL
    const response = await fetch(baseURL)
    const data = await response.json()

    const filteredTags = data.results.filter((tag) => {
      const isVersionMatch = tag.name.startsWith(version)
      const isAlpine = withAlpine ? tag.name.includes('alpine') : true
      const isArchitectureMatch = tag.images.some(
        (image) => image.architecture === architecture,
      )
      return isVersionMatch && isAlpine && isArchitectureMatch
    })

    const latestTag = filteredTags.sort((a, b) =>
      b.last_updated.localeCompare(a.last_updated),
    )[0]

    if (latestTag) {
      return latestTag.name
    }
    const nextUrl = data.next
    if (!nextUrl) {
      return null
    }
    return getVersion(version, withAlpine, architecture, nextUrl)
  } catch (error) {
    console.error('Failed to fetch the Docker tags', error)
  }
}

async function getPackageVersion() {
  const content = await getPackageJSON()
  const version = content.engines?.node
  if (!version) {
    throw new Error(`Cannot find node version`)
  }
  return version
}
