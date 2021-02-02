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

// get a list of all latest commits for this repo
const getCommits = async (): Promise<string[]> => {
  const commitsEndpoint = `https://api.github.com/repos/${environment.dictRepo}/commits`
  const commits: Commit[] = await fetch(commitsEndpoint).then((response) =>
    response.json(),
  ) // this is rate limited to 60 requests an hour // TODO: Fix this b4 release
  return commits.map((commit) => commit.sha)
}

export const getDictionaryVersions = async () => {
  const commits = await getCommits()
  return commits.map((commit) => commit.substring(0, 7))
}

export const getDictionaryFilesAfterVersion = async (
  currentVersion: string,
): Promise<Dictionary[]> => {
  const commits = await getCommits()
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
