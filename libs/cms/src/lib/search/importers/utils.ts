import flatten from 'lodash/flatten'

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

/**
 * Goes through keys in an entry-hyperlink node and deletes objects that are at depth 2
 */
export const pruneEntryHyperlink = (node: any) => {
  if (node?.data?.target?.fields) {
    const fields = node.data.target.fields
    for (const key of Object.keys(fields)) {
      if (typeof fields[key]?.['fields'] === 'object') {
        for (const nestedKey of Object.keys(fields[key]['fields'])) {
          if (typeof fields[key]['fields'][nestedKey] === 'object') {
            delete fields[key]['fields'][nestedKey]
          }
        }
      }
    }
  }
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
