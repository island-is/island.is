import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

/** Converts a Regulation `name` into a URL path segment
 *
 *  Example: '0123/2020' --> '0123-2020'
 */
export const nameToSlug = (regulationName: string, seperator?: string) => {
  // const [number, year] = regulationName.split('/')
  // return year + (seperator || '/') + number
  return regulationName.replace('/', seperator || '-')
}

export const useRegulationLinkResolver = () => {
  const utils = useLinkResolver()
  return {
    ...utils,
    linkToRegulation: (regulationName: string) =>
      utils.linkResolver('regulation', [regulationName]).href,
  }
}
