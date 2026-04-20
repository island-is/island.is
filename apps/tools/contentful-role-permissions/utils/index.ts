import {
  CollectionProp,
  ContentTypeProps,
  createClient as createManagementClient,
  PlainClientAPI,
  Role,
  RoleProps,
  TagProps,
} from 'contentful-management'
import type { ActionType } from 'contentful-management/dist/typings/entities/role'
import slugify from '@sindresorhus/slugify'

import { sortAlpha } from '@island.is/shared/utils'

import {
  contentfulManagementAccessToken,
  environmentId,
  spaceId,
} from '../constants'
import type { CheckboxState } from '../types'

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
  let contentfulTypesResponse: CollectionProp<ContentTypeProps> | null = null

  const contentTypes: ContentTypeProps[] = []

  while (
    contentfulTypesResponse === null ||
    contentTypes.length < contentfulTypesResponse.total
  ) {
    contentfulTypesResponse = await client.contentType.getMany({
      query: {
        limit: 100,
        skip: contentTypes.length,
      },
    })
    for (const type of contentfulTypesResponse.items) contentTypes.push(type)
  }

  contentTypes.sort(sortAlpha('name'))

  return contentTypes
}

export const getAllTags = async () => {
  const client = getContentfulManagementApiClient()
  const response = await client.tag.getMany({
    query: {
      limit: 1000,
    },
  })
  const tags = response.items
  return tags
}

export const getTagNameToTagIdMap = (tags: TagProps[]) => {
  return new Map(tags.map((tag) => [tag.name, tag.sys.id]))
}

const policiesAreEditable = (
  role: RoleProps,
  contentType: ContentTypeProps,
) => {
  const policies = []
  applySingleEntryAllowAllPolicy(policies, contentType.sys.id)
  return policies.every((p1) =>
    role.policies.find((p2) => JSON.stringify(p1) === JSON.stringify(p2)),
  )
}

const policiesAreReadOnlyEntries = (
  role: RoleProps,
  contentType: ContentTypeProps,
) => {
  const policies = []
  applySingleEntryGlobalReadPolicy(policies, contentType.sys.id)

  return (
    role.policies.find((p) => {
      return JSON.stringify(policies[0]) === JSON.stringify(p)
    }) !== undefined
  )
}

export const extractInitialCheckboxStateFromRolesAndContentTypes = (
  roles: RoleProps[],
  contentTypes: ContentTypeProps[],
): CheckboxState => {
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

export const extractInitialReadonlyCheckboxStateFromRolesAndContentTypes = (
  roles: RoleProps[],
  contentTypes: ContentTypeProps[],
): CheckboxState => {
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
  tagsMap: Map<string, string>,
): string[] => {
  const roleNames: string[] = []
  for (const role of roles) {
    const policies = []
    applyAssetPolicies(policies, true, tagsMap.get(slugify(role.name)))
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
  allowReadingAllAssets = false,
  tagId: string,
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
                in: [{ doc: 'metadata.tags.sys.id' }, [tagId]],
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

const applySingleEntryGlobalReadPolicy = (
  policies: Role['policies'],
  contentTypeId: string,
) => {
  policies.push({
    actions: ['read'],
    effect: 'allow',
    constraint: {
      and: [
        { equals: [{ doc: 'sys.type' }, 'Entry'] },
        {
          equals: [{ doc: 'sys.contentType.sys.id' }, contentTypeId],
        },
      ],
    },
  })
}

export const applyEntryGlobalReadPolicies = (
  policies: Role['policies'],
  contentTypeIds: Set<string>,
) => {
  for (const id of contentTypeIds) {
    applySingleEntryGlobalReadPolicy(policies, id)
  }
}

const applySingleEntryAllowAllPolicy = (
  policies: Role['policies'],
  contentTypeId: string,
) => {
  policies.push({
    actions: 'all',
    effect: 'allow',
    constraint: {
      and: [
        { equals: [{ doc: 'sys.type' }, 'Entry'] },
        {
          equals: [{ doc: 'sys.contentType.sys.id' }, contentTypeId],
        },
      ],
    },
  })
}

export const applyEntryEditPolicies = (
  policies: Role['policies'],
  scopedEditableContentTypeIds: Set<string>,
  tagId: string,
  globallyReadableContentTypeIds: Set<string>,
) => {
  const allContentTypeIds = new Set<string>()

  for (const id of scopedEditableContentTypeIds) {
    allContentTypeIds.add(id)
    applySingleEntryAllowAllPolicy(policies, id)
  }

  for (const id of globallyReadableContentTypeIds) {
    allContentTypeIds.add(id)
  }

  for (const id of allContentTypeIds) {
    if (!scopedEditableContentTypeIds.has(id)) continue

    const actions: ActionType[] = [
      'update',
      'delete',
      'publish',
      'unpublish',
      'archive',
      'unarchive',
    ]

    if (!globallyReadableContentTypeIds.has(id)) {
      actions.push('read')
    }

    policies.push({
      actions,
      effect: 'deny',
      constraint: {
        and: [
          { equals: [{ doc: 'sys.type' }, 'Entry'] },
          {
            equals: [{ doc: 'sys.contentType.sys.id' }, id],
          },
          {
            not: {
              or: [
                { equals: [{ doc: 'sys.createdBy.sys.id' }, 'User.current()'] },
                { in: [{ doc: 'metadata.tags.sys.id' }, [tagId]] },
              ],
            },
          },
        ],
      },
    })
  }
}

export const narrowDownCheckboxState = (
  checkboxState: CheckboxState,
  enabledRoleName: string,
) => {
  const state = checkboxState[enabledRoleName]
  if (state) {
    return { [enabledRoleName]: state }
  }
  return {}
}
