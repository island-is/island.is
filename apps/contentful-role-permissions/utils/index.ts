import {
  contentfulManagementAccessToken,
  spaceId,
  environmentId,
} from '../constants'
import {
  ContentTypeProps,
  createClient as createManagementClient,
  PlainClientAPI,
  RoleProps,
} from 'contentful-management'

let client: PlainClientAPI | null = null

export const getContentfulManagementApiClient = (): PlainClientAPI => {
  if (!client) {
    client = createManagementClient(
      {
        accessToken: contentfulManagementAccessToken,
      },
      { type: 'plain', defaults: { spaceId, environmentId } },
    )
  }
  return client
}

export const getAllRoles = async () => {
  const client = getContentfulManagementApiClient()
  const rolesResult = await client.role.getMany({ query: { limit: 1000 } })
  const roles = rolesResult.items
  return roles
}

export const getAllContentTypesInAscendingOrder = async () => {
  const client = getContentfulManagementApiClient()
  const contentfulTypesResponse = await client.contentType.getMany({
    limit: 1000,
  })
  const contentTypes = contentfulTypesResponse.items
  contentTypes.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  )
  return contentfulTypesResponse.items
}

export const extractInitialCheckboxStateFromRolesAndContentTypes = (
  roles: RoleProps[],
  contentTypes: ContentTypeProps[],
  contentTypeIdsThatAreChecked: string[],
): Record<string, Record<string, boolean>> => {
  return roles.reduce(
    (roleAccumulator, role) => ({
      ...roleAccumulator,
      [role.name]: contentTypes.reduce(
        (contentTypeAccumulator, contentType) => ({
          ...contentTypeAccumulator,
          [contentType.name]: contentTypeIdsThatAreChecked.includes(
            contentType.sys.id,
          ),
        }),
        {},
      ),
    }),
    {},
  )
}
