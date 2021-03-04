import fetch from 'node-fetch'
import flatten from 'lodash/flatten'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { logger } from '@island.is/logging'
import { environment } from '../../environments/environment'
import { AwsEsPackage } from './aws'

// Analyzers name must not exceed 20 in length and must satisfy this pattern [a-z][a-z0-9\\-]+
const analyzers = [
  'stemmer',
  'keywords',
  'synonyms',
  'stopwords',
  'hyphenwhitelist',
  'autocompletestop',
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
  ) // this is rate limited to 60 requests an hour
  return commits.map((commit) => commit.sha)
}

export const getDictionaryFilesForVersion = async (
  currentVersion: string,
): Promise<Dictionary[]> => {
  const commits = await getCommits()

  // find the whole commit sha for this version
  const commit = commits.find((commit) => commit.startsWith(currentVersion))

  logger.info('Getting dictionary files from dictionary repo', {
    commit,
  })

  // fetch all missing dictionary files for each version
  const dictionaryFiles: Dictionary[] = []
  for (const locale of environment.locales) {
    for (const analyzer of analyzers) {
      const file = await getDictionaryFile(commit, locale, analyzer)
      // all versions don't have all files
      if (file) {
        dictionaryFiles.push({
          analyzerType: analyzer,
          version: currentVersion,
          file,
          locale,
        })
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
