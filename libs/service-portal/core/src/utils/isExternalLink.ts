const externalRegex = new RegExp('^(https?://|//)')

/**
 * Links outside of service-portal need to be treated as external links
 */
export const isExternalLink = (value: string): boolean => {
  return !!value.match(externalRegex)
}
