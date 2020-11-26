import { createClient } from 'contentful-management'

export interface ContentfulEnv {
  managementAccessToken: string
  space: string
  environment: string
}

export const createContentfulClient = async ({
  managementAccessToken,
  space,
  environment,
}: ContentfulEnv) => {
  const getClient = createClient({ accessToken: managementAccessToken })
  const getSpace = await getClient.getSpace(space)
  const getEnvironment = await getSpace.getEnvironment(environment)

  return {
    client: getClient,
    space: getSpace,
    env: getEnvironment,
  }
}
