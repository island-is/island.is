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

const policiesAreEditable = (
  role: RoleProps,
  contentType: ContentTypeProps,
) => {
  let canEditContentType = false
  for (const policy of role.policies) {
    if (policy.actions === 'all' && policy.effect === 'allow') {
      if (
        !policy.constraint.equals &&
        !policy.constraint.not &&
        !policy.constraint.or &&
        policy.constraint.and
      ) {
        for (const obj of policy.constraint.and) {
          if (obj.equals && obj.equals.length === 2) {
            console.log(
              role.name,
              obj.equals[0].doc,
              obj.equals[1],
              contentType.name,
            )
            if (
              obj.equals[0].doc === 'sys.contentType.sys.id' &&
              obj.equals[1] === contentType.sys.id
            ) {
              canEditContentType = true
              break
            }
          }
        }
      }
    }
  }

  return canEditContentType
}

export const extractInitialCheckboxStateFromRolesAndContentTypes = (
  roles: RoleProps[],
  contentTypes: ContentTypeProps[],
): Record<string, Record<string, boolean>> => {
  return roles.reduce(
    (roleAccumulator, role) => ({
      ...roleAccumulator,
      [role.name]: contentTypes.reduce(
        (contentTypeAccumulator, contentType) => ({
          ...contentTypeAccumulator,
          [contentType.name]: policiesAreEditable(role, contentType),
        }),
        {},
      ),
    }),
    {},
  )
}
