// Usage of * avoided so that the regex does not become greedy
// It's fair to assume that for an URL to exceed 2048 characters is a mistake
// If an internal link is to hit this limit it will be reported as external but
// such a link should in any case be reconsidered with regards to length
const hosts = '(island\\.is|devland\\.is|localhost:\\d{4,5})'
const template = `^https{0,1}:\\/\\/([^\\/]{1,2048}\\.){0,1}${hosts}(\\/|$)`
const islandisRe = new RegExp(template)

export const isLinkExternal = (href: string): boolean => {
  const externalCandidate =
    typeof href === 'string' && href.indexOf('://') !== -1

  return externalCandidate && !Boolean(href.match(islandisRe))
}

export const isLinkInternal = (href: string): boolean => {
  return !isLinkExternal(href)
}
