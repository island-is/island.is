import fetch from 'node-fetch'
import { environment } from '../environments/environment'
import { logger } from '@island.is/logging'
import flatten from 'lodash/flatten'
import { AwsEsPackage } from './aws'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

// Analyzers name must not exceed 20 in length and must satisfy this pattern [a-z][a-z0-9\\-]+
const analyzers = [
  'stemmer',
  'keywords',
  'synonyms',
  'stopwords',
  'hyphenpatterns',
  'hyphenwhitelist',
]

export interface Dictionary {
  version: string
  analyzerType: string
  locale: ElasticsearchIndexLocale
  file: NodeJS.ReadableStream
}

interface Commit {
  sha: string
}

const getDictionaryFile = (
  sha: string,
  locale: ElasticsearchIndexLocale,
  analyzer: string,
) => {
  return fetch(
    `https://github.com/${environment.dictRepo}/blob/${sha}/${locale}/${analyzer}.txt?raw=true`,
  ).then((response) => {
    if (response.ok) {
      return response.body
    } else {
      return null
    }
  })
}

const mockCommits: Commit[] = [
  { sha: '7139c83db5e95e9f245ebd1265f0ddd8b4e25fcc' },
  { sha: '9d3a04eee314d4940a23fe46092c0365d2493ff8' },
  { sha: 'd4171f9c87909d269f6149c9fead5e51937b0709' },
  { sha: '5d2c6703ea8de3115b39cd314c34f20c4f46e65d' },
  { sha: '4cc984082460b81263b09124598f504d6e3f5db3' },
]

// get a list of all latest commits for this repo
const getCommits = (): string[] => {
  const commitsEndpoint = `https://api.github.com/repos/${environment.dictRepo}/commits`
  const commits: Commit[] = mockCommits // await fetch(commitsEndpoint).then(response => response.json()) // this is rate limited to 60 requests an hour // TODO: Fix this b4 release
  return commits.map((commit) => commit.sha)
}

export const getDictionaryVersions = () => {
  return getCommits().map((commit) => commit.substring(0, 7))
}

export const getDictionaryFilesAfterVersion = async (
  currentVersion: string,
): Promise<Dictionary[]> => {
  const commits = getCommits()
  let newCommits
  if (currentVersion) {
    // find what versions are missing given the current found version
    const currentVersionIndex = commits.findIndex((commit) =>
      commit.startsWith(currentVersion),
    )
    // we just want to import commits between last commit and current HEAD
    newCommits = commits.slice(0, currentVersionIndex)
  } else {
    // if we don't have a version we will import all commits
    newCommits = commits
  }

  logger.info('Trying to get dictionary files from dictionary repo', {
    commits: newCommits,
  })

  // fetch all missing dictionary files for each version
  const dictionaryFiles: Dictionary[] = []
  for (const commit of newCommits) {
    for (const locale of environment.locales) {
      for (const analyzer of analyzers) {
        const version = commit.substring(0, 7)
        const file = await getDictionaryFile(commit, locale, analyzer)
        // all versions don't have all files
        if (file) {
          dictionaryFiles.push({
            analyzerType: analyzer,
            version,
            file,
            locale,
          })
        }
      }
    }
  }

  logger.info('Done getting dictionary files from dictionary repo', {
    fileCount: dictionaryFiles.length,
  })

  return dictionaryFiles
}

export const getFakeEsPackages = (): AwsEsPackage[] => {
  const locales = environment.locales
  const fakePackages = locales.map((locale) => {
    return analyzers.map((analyzer) => ({
      packageId: `${analyzer}.txt`,
      analyzerType: analyzer,
      locale,
    }))
  })
  return flatten(fakePackages)
}
