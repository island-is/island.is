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
  const policies = []
  applyEditEntryPolicies(policies, role.name, contentType)
  return policies.every((p1) =>
    role.policies.find((p2) => JSON.stringify(p1) === JSON.stringify(p2)),
  )
}

const policiesAreReadOnlyEntries = (
  role: RoleProps,
  contentType: ContentTypeProps,
) => {
  const policies = []
  applyReadOnlyEntryPolicies(policies, contentType)
  return policies.every((p1) =>
    role.policies.find((p2) => JSON.stringify(p1) === JSON.stringify(p2)),
  )
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

export const extractInitialRoleNamesThatCanReadAllAssetsFromRoles = (
  roles: RoleProps[],
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

export const applyEditEntryPolicies = (
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
        { equals: [{ doc: 'sys.contentType.sys.id' }, contentType.sys.id] },
        {
          in: [{ doc: 'metadata.tags.sys.id' }, [slugify(roleName)]],
        },
      ],
    },
  })
  policies.push({
    actions: 'all',
    effect: 'allow',
    constraint: {
      and: [
        { equals: [{ doc: 'sys.type' }, 'Entry'] },
        { equals: [{ doc: 'sys.contentType.sys.id' }, contentType.sys.id] },
        {
          equals: [{ doc: 'sys.createdBy.sys.id' }, 'User.current()'],
        },
      ],
    },
  })
}

export const applyReadOnlyEntryPolicies = (
  policies: Role['policies'],
  contentType: ContentTypeProps,
) => {
  policies.push({
    actions: ['read'],
    effect: 'allow',
    constraint: {
      and: [
        { equals: [{ doc: 'sys.type' }, 'Entry'] },
        { equals: [{ doc: 'sys.contentType.sys.id' }, contentType.sys.id] },
      ],
    },
  })
}
