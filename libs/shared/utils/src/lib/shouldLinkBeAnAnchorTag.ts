import { ProjectBasePath } from '@island.is/shared/constants'

/** Some links point users to another project (like if a user clicks on a /minarsidur link in the web project),
 * then the link should be an anchor tag instead of a nextlink for example
 * */
export const shouldLinkBeAnAnchorTag = (path: string) =>
  Object.values(ProjectBasePath).some((basePath) => path.includes(basePath)) ||
  path.startsWith('/rss.xml')
