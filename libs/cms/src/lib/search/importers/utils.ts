import { writeFileSync } from 'fs'
import flatten from 'lodash/flatten'
import { inspect } from 'util'
import { CONTENT_TYPE } from '../../generated/contentfulTypes'

export const createTerms = (termStrings: string[]): string[] => {
  const singleWords = termStrings.map((termString = '') => {
    const words = termString
      .toLowerCase()
      .replace(/[^a-záðéíóúýþæö]+/g, ' ') // remove all non characters
      .split(/\s+/)
    return words
  })
  return flatten(singleWords).filter((word) => word.length > 1) // filter out 1 letter words and empty string
}

export const extractStringsFromObject = (
  contentObject: object,
  maxDepth = 100,
): string => {
  // we have reached the max depth in the object
  if (maxDepth === 0) {
    return ''
  }
  return Object.values(contentObject).reduce((contentString, content) => {
    if (Array.isArray(content)) {
      // lets extract string from nested arrays
      return (
        contentString + extractStringsFromObject({ ...content }, maxDepth - 1)
      )
    } else if (content && typeof content === 'object') {
      // lets extract string from nested objects
      return contentString + extractStringsFromObject(content, maxDepth - 1)
    } else if (typeof content === 'string') {
      try {
        const parsedContent = JSON.parse(content)
        return (
          contentString + extractStringsFromObject(parsedContent, maxDepth - 1)
        )
      } catch (e) {
        // we only consider string of more than 3 words valid content strings
        if (content.split(/\s+/).length > 3) {
          return `${contentString} ${content}`
        }
      }
    }
    return contentString
  }, '')
}

const getEntriesByTypeName = (contentList: any[], typename: string) =>
  contentList.filter((content) => content.typename === typename)

const getAssetsByContentType = (contentList: object[], contentType: string) => {
  const assets = getEntriesByTypeName(contentList, 'Asset')
  return assets.filter((asset) => asset.contentType === contentType)
}

const getProcessEntries = (contentList: object[]) =>
  getEntriesByTypeName(contentList, 'ProcessEntry')

export const numberOfLinks = (contentList: object[]) => {
  const processLinks = getProcessEntries(contentList).map(
    (entry) => new URL(entry.processLink, 'https://island.is'),
  )
  const fillAndSignProcessLinks = processLinks.filter((url) =>
    url.hostname.includes('dropandsign.is'),
  ).length
  const pdfProcessLinks = processLinks.filter((url) =>
    url.pathname.endsWith('.pdf'),
  ).length
  const wordProcessLinks = processLinks.filter((url) =>
    url.pathname.endsWith('.docx'),
  ).length
  const externalProcessLinks = processLinks.filter((url) => {
    if (url.hostname.includes('innskraning.island.is')) {
      return true
    }
    return !url.hostname.includes('island.is')
  }).length

  const pdfAssets = getAssetsByContentType(
    contentList,
    'application/pdf',
  ).length
  const wordAssets = getAssetsByContentType(
    contentList,
    'application/msword',
  ).length

  return {
    fillAndSignLinks: fillAndSignProcessLinks,
    pdfLinks: pdfAssets + pdfProcessLinks,
    wordLinks: wordAssets + wordProcessLinks,
    externalLinks:
      externalProcessLinks -
      pdfProcessLinks -
      wordProcessLinks -
      fillAndSignProcessLinks,
  }
}

export const numberOfProcessEntries = (contentList: any[]) =>
  getProcessEntries(contentList).length

const removeNonPrimitiveFields = (node: Record<string, unknown>) => {
  if (typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (typeof node[key] === 'object') {
        delete node[key]
      }
    }
  }
}

export const pruneEntryHyperlink = (node: any) => {
  const target = node?.data?.target
  const contentTypeId: CONTENT_TYPE = target?.sys?.contentType?.sys?.id

  // Keep specific fields in case they are needed to form urls
  if (contentTypeId === 'subArticle' && target.fields?.parent) {
    const parentArticle = { ...target.fields.parent }
    removeNonPrimitiveFields(parentArticle)
    target.fields.parent = parentArticle
  } else if (
    contentTypeId === 'organizationSubpage' &&
    target.fields?.organizationPage
  ) {
    const organizationPage = { ...target.fields.organizationPage }
    removeNonPrimitiveFields(organizationPage)
    target.fields.organizationPage = organizationPage
  }

  // Always only keep primitive fields
  removeNonPrimitiveFields(target?.fields)
}

export const removeEntryHyperlinkFields = (node: any) => {
  if (node?.nodeType === 'entry-hyperlink') {
    pruneEntryHyperlink(node)
  } else if (node?.content && node.content.length > 0) {
    for (const contentNode of node.content) {
      removeEntryHyperlinkFields(contentNode)
    }
  }
}
