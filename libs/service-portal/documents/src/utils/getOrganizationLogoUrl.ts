interface Organization {
  id: string
  title: string
  logo: null | {
    id: string
    url: string
    title: string
    width: number
    height: number
  }
}

const getOrganizationLogoUrl = (
  forName: string,
  orgs: Array<Organization>,
): string => {
  if (orgs.length > 0) {
    const qs = String(forName).trim().toLocaleLowerCase()
    const match =
      orgs.find((o: Organization) => o.title?.toLocaleLowerCase() === qs) ||
      orgs.find((o: Organization) => o.logo?.title === 'Skjaldarmerki')
    const c = match?.logo?.url
    const url =
      c ??
      'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'
    const uri = `${url}?w=60&h=60&fit=pad&bg=white&fm=png`
    return uri
  }
  return ''
}

export default getOrganizationLogoUrl
