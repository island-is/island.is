import { Organization } from '@island.is/shared/types'

export const getOrganizationLogoUrl = (
  forName: string,
  orgs: Array<Organization>,
  size = 60,
  bg = 'white',
): string => {
  const fallBackImage =
    'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'
  const parameters = `?w=${size}&h=${size}&fit=pad&bg=${bg}&fm=png`
  if (orgs.length > 0) {
    const qs = String(forName).trim().toLocaleLowerCase()
    const match =
      orgs.find((o: Organization) => o.title?.toLocaleLowerCase() === qs) ||
      orgs.find((o: Organization) => o.logo?.title === 'Skjaldarmerki')
    const c = match?.logo?.url
    const url = c ?? fallBackImage
    return url.concat(parameters)
  }
  return fallBackImage.concat(parameters)
}
