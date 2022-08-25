import {
  contentfulManagementAccessToken,
  spaceId,
  environmentId,
} from '../constants'
import {
  ContentTypeProps,
  createClient as createManagementClient,
  PlainClientAPI,
  Role,
  RoleProps,
} from 'contentful-management'
import slugify from '@sindresorhus/slugify'
import type { ActionType } from 'contentful-management/dist/typings/entities/role'

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

const policiesAreReadOnlyEntries = (
  role: RoleProps,
  contentType: ContentTypeProps,
) => {
  return false
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

export const extractInititalReadonlyCheckboxStateFromRolesAndContentTypes = (
  roles: RoleProps[],
  contentTypes: ContentTypeProps[],
): Record<string, Record<string, boolean>> => {
  return roles.reduce(
    (roleAccumulator, role) => ({
      ...roleAccumulator,
      [role.name]: contentTypes.reduce(
        (contentTypeAccumulator, contentType) => ({
          ...contentTypeAccumulator,
          [contentType.name]: policiesAreReadOnlyEntries(role, contentType),
        }),
        {},
      ),
    }),
    {},
  )
}

export const extractInitialRoleNamesThatCanReadAllAssetsFromRolesAndContentTypes = (
  roles: RoleProps[],
  contentTypes: ContentTypeProps[],
): string[] => {
  const roleNames: string[] = []
  for (const role of roles) {
    const policies = []
    applyAssetPolicies(policies, role.name, true)
    if (
      policies.every((p1) =>
        role.policies.find((p2) => JSON.stringify(p1) === JSON.stringify(p2)),
      )
    ) {
      roleNames.push(role.name)
    }
  }

  return roleNames
}

export const applyAssetPolicies = (
  policies: Role['policies'],
  roleName: string,
  allowReadingAllAssets = false,
) => {
  policies.push({
    actions: [
      'create',
      'read',
      'update',
      'delete',
      'publish',
      'unpublish',
      'archive',
      'unarchive',
    ],
    effect: 'allow',
    constraint: {
      and: [{ equals: [{ doc: 'sys.type' }, 'Asset'] }],
    },
  })

  let disallowedActions: ActionType[] = ['read']

  if (allowReadingAllAssets) {
    disallowedActions = [
      'update',
      'delete',
      'publish',
      'unpublish',
      'archive',
      'unarchive',
    ]
  }

  policies.push({
    actions: disallowedActions,
    effect: 'deny',
    constraint: {
      and: [
        { equals: [{ doc: 'sys.type' }, 'Asset'] },
        {
          not: {
            or: [
              {
                in: [{ doc: 'metadata.tags.sys.id' }, [slugify(roleName)]],
              },
              {
                equals: [{ doc: 'sys.createdBy.sys.id' }, 'User.current()'],
              },
            ],
          },
        },
      ],
    },
  })
}

export const applyEntryPolicies = (
  policies: Role['policies'],
  roleName: string,
  contentType: ContentTypeProps,
) => {
  policies.push({
    actions: 'all',
    effect: 'allow',
    constraint: {
      and: [
        { equals: [{ doc: 'sys.type' }, 'Entry'] },
        {
          equals: [{ doc: 'sys.contentType.sys.id' }, contentType.sys.id],
        },
      ],
    },
  })
  policies.push({
    actions: ['read'],
    effect: 'deny',
    constraint: {
      and: [
        { equals: [{ doc: 'sys.type' }, 'Entry'] },
        { equals: [{ doc: 'sys.contentType.sys.id' }, contentType.sys.id] },
        {
          not: {
            or: [
              {
                in: [{ doc: 'metadata.tags.sys.id' }, [slugify(roleName)]],
              },
              {
                equals: [{ doc: 'sys.createdBy.sys.id' }, 'User.current()'],
              },
            ],
          },
        },
      ],
    },
  })
}
