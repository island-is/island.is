import flatten from 'lodash/flatten'
import type { CONTENT_TYPE } from '../../generated/contentfulTypes'
import type { SliceUnion } from '../../unions/slice.union'

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
  minimumWordCountToBeIncluded = 4,
): string => {
  // we have reached the max depth in the object
  if (maxDepth === 0) {
    return ''
  }
  return Object.values(contentObject).reduce((contentString, content) => {
    if (Array.isArray(content)) {
      // lets extract string from nested arrays
      return (
        contentString +
        extractStringsFromObject(
          { ...content },
          maxDepth - 1,
          minimumWordCountToBeIncluded,
        )
      )
    } else if (content && typeof content === 'object') {
      // lets extract string from nested objects
      return (
        contentString +
        extractStringsFromObject(
          content,
          maxDepth - 1,
          minimumWordCountToBeIncluded,
        )
      )
    } else if (typeof content === 'string') {
      try {
        const parsedContent = JSON.parse(content)
        return (
          contentString +
          extractStringsFromObject(
            parsedContent,
            maxDepth - 1,
            minimumWordCountToBeIncluded,
          )
        )
      } catch (e) {
        // only include strings that are at least of a minimum word count length
        if (content.split(/\s+/).length >= minimumWordCountToBeIncluded) {
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

const extractPrimitiveFields = (node: Record<string, unknown>) => {
  if (typeof node !== 'object') return node

  const map = new Map<string, unknown>()

  for (const key of Object.keys(node)) {
    if (typeof node[key] !== 'object') {
      map.set(key, node[key])
    }
  }

  return Object.fromEntries(map)
}

export const pruneEntryHyperlink = (node: any) => {
  const target = node?.data?.target
  const contentTypeId: CONTENT_TYPE = target?.sys?.contentType?.sys?.id

  // Keep specific non primitive fields since we'll need them when creating the urls
  if (contentTypeId === 'subArticle' && target.fields?.parent?.fields) {
    node.data.target = {
      ...target,
      fields: {
        ...extractPrimitiveFields(target.fields),
        parent: {
          ...target.fields.parent,
          fields: extractPrimitiveFields(target.fields.parent.fields),
        },
      },
    }
  } else if (
    contentTypeId === 'organizationSubpage' &&
    target.fields?.organizationPage?.fields
  ) {
    node.data.target = {
      ...target,
      fields: {
        ...extractPrimitiveFields(target.fields),
        organizationPage: {
          ...target.fields.organizationPage,
          fields: extractPrimitiveFields(target.fields.organizationPage.fields),
        },
        organizationParentSubpage: target.fields.organizationParentSubpage
          ? {
              ...target.fields.organizationParentSubpage,
              fields: extractPrimitiveFields(
                target.fields.organizationParentSubpage.fields,
              ),
            }
          : null,
      },
    }
  } else if (
    contentTypeId === 'organizationParentSubpage' &&
    target.fields?.organizationPage?.fields
  ) {
    node.data.target = {
      ...target,
      fields: {
        ...extractPrimitiveFields(target.fields),
        organizationPage: {
          ...target.fields.organizationPage,
          fields: extractPrimitiveFields(target.fields.organizationPage.fields),
        },
      },
    }
  } else if (contentTypeId === 'price' && target.fields?.organization?.fields) {
    node.data.target = {
      ...target,
      fields: {
        ...extractPrimitiveFields(target.fields),
        parent: {
          ...target.fields.organization,
          fields: extractPrimitiveFields(target.fields.organization.fields),
        },
      },
    }
  }
  // In case there is no need to preserve non primitive fields we just remove them to prevent potential circularity
  else if (target?.fields) {
    node.data.target = {
      ...target,
      fields: extractPrimitiveFields(target.fields),
    }
  }
}

export const removeEntryHyperlinkFields = (node: any) => {
  if (
    node?.nodeType === 'entry-hyperlink' ||
    node?.nodeType === 'embedded-entry-inline'
  ) {
    pruneEntryHyperlink(node)
  } else if (node?.content && node.content.length > 0) {
    for (const contentNode of node.content) {
      removeEntryHyperlinkFields(contentNode)
    }
  }
}

export const pruneNonSearchableSliceUnionFields = (
  slice: typeof SliceUnion,
) => {
  if ((slice as { typename?: string })?.typename === 'ConnectedComponent') {
    return {
      ...slice,
      json: {},
      configJson: {},
      translationStrings: {},
    }
  }
  if ((slice as { typename?: string })?.typename === 'EmailSignup') {
    return {
      ...slice,
      configuration: {},
      translations: {},
    }
  }
  return slice
}

export const extractChildEntryIds = <T>(rootNode: {
  fields: T
  sys: { id: string }
}): string[] => {
  const childIds: string[] = []

  // Keys that don't lead to an entry id if traversed further down
  const skippedKeys = ['contentType', 'space', 'environment']

  const extractChildEntryIdsRecursive = (
    node: T,
    visited = new Set(),
    keyAbove = '',
  ) => {
    if (!node || visited.has(node)) return

    visited.add(node)

    for (const key in node) {
      const value = node[key]
      if (
        typeof value === 'string' &&
        keyAbove === 'sys' &&
        key === 'id' &&
        value !== rootNode.sys.id // The root node is not it's own child
      ) {
        childIds.push(value)
      } else if (
        typeof value === 'object' &&
        value !== null &&
        !skippedKeys.includes(key)
      ) {
        extractChildEntryIdsRecursive(value as T, visited, key)
      }
    }
  }

  extractChildEntryIdsRecursive(rootNode.fields)

  return childIds
}
