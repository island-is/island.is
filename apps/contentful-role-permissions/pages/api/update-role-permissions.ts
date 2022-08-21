import { ContentTypeProps, RoleProps } from 'contentful-management'
import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from '@sindresorhus/slugify'
import {
  extractInitialCheckboxStateFromRolesAndContentTypes,
  getAllContentTypesInAscendingOrder,
  getAllRoles,
  getContentfulManagementApiClient,
} from '../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body) as ReturnType<
    typeof extractInitialCheckboxStateFromRolesAndContentTypes
  >

  const client = getContentfulManagementApiClient()

  const rolesMap = new Map<string, RoleProps>()
  const contentTypesMap = new Map<string, ContentTypeProps>()

  const roles = await getAllRoles()
  for (const role of roles) {
    rolesMap.set(role.name, role)
  }

  const contentTypes = await getAllContentTypesInAscendingOrder()
  for (const contentType of contentTypes) {
    contentTypesMap.set(contentType.name, contentType)
  }

  const updateQueries = []

  for (const roleName in data) {
    console.log(roleName)
    const role = rolesMap.get(roleName)
    if (!role) continue
    console.log(roleName + ' passed')

    if (!roleName.includes('test')) continue

    const policies = []

    for (const contentTypeName in data[roleName]) {
      const contentType = contentTypesMap.get(contentTypeName)
      if (!contentType) continue

      const checked = data[roleName][contentTypeName]
      if (!checked) continue

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
                    in: [{ doc: 'metadata.tags.sys.id' }, [slugify(role.name)]],
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

    const updateQuery = client.role.update(
      { roleId: role.sys.id },
      {
        ...role,
        policies,
      },
    )

    updateQueries.push(updateQuery)
  }

  const responses = await Promise.all(updateQueries)

  return res.status(200).json(data)

  const role = await client.role.get({ roleId: '0erjZjY5zJdMHWBwOeX9rm' })

  // console.log(JSON.stringify(role.policies))[
  //   {
  //     effect: 'allow',
  //     constraint: { and: [{ equals: [{ doc: 'sys.type' }, 'Entry'] }] },
  //     actions: 'all',
  //   }
  // ]

  const d = JSON.parse(
    `{"name":"Owner-testTeam","description":"Testing this","policies":[{"effect":"allow","actions":["create"],"constraint":{"and":[{"equals":[{"doc":"sys.type"},"Entry"]},{"equals":[{"doc":"sys.contentType.sys.id"},"article"]}]}},{"effect":"allow","actions":["read"],"constraint":{"and":[{"equals":[{"doc":"sys.type"},"Entry"]},{"equals":[{"doc":"sys.contentType.sys.id"},"article"]},{"in":[{"doc":"metadata.tags.sys.id"},"owner-test-team"]}]}},{"effect":"allow","actions":["read"],"constraint":{"and":[{"equals":[{"doc":"sys.type"},"Entry"]},{"equals":[{"doc":"sys.contentType.sys.id"},"article"]},{"in":[{"doc":"sys.createdBy.sys.id"},"User.current()"]}]}}],"permissions":{"ContentModel":["read"],"Settings":[],"ContentDelivery":[],"Environments":[],"EnvironmentAliases":[],"Tags":[]},"sys":{"type":"Role","id":"0erjZjY5zJdMHWBwOeX9rm","version":38,"space":{"sys":{"type":"Link","linkType":"Space","id":"8k0h54kbe6bj"}},"createdBy":{"sys":{"type":"Link","linkType":"User","id":"6jxc04boUYN2MG16yhaItS"}},"createdAt":"2022-08-19T20:40:05Z","updatedBy":{"sys":{"type":"Link","linkType":"User","id":"6jxc04boUYN2MG16yhaItS"}},"updatedAt":"2022-08-20T15:40:57Z"}}`,
  )

  // [
  //   {
  //     effect: 'allow',
  //     actions: ['create'],
  //     constraint: {
  //       and: [
  //         { equals: [{ doc: 'sys.type' }, 'Entry'] },
  //         { equals: [{ doc: 'sys.contentType.sys.id' }, 'article'] },
  //       ],
  //     },
  //   },
  //   {
  //     effect: 'allow',
  //     actions: ['read'],
  //     constraint: {
  //       and: [
  //         { equals: [{ doc: 'sys.type' }, 'Entry'] },
  //         { equals: [{ doc: 'sys.contentType.sys.id' }, 'article'] },
  //         {
  //           or: [
  //             {
  //               in: [{ doc: 'metadata.tags.sys.id' }, ['owner-test-team']],
  //             },
  //             {
  //               equals: [{ doc: 'sys.createdBy.sys.id' }, 'User.current()'],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  // ],

  console.log(data)

  await client.role.update(
    { roleId: '0erjZjY5zJdMHWBwOeX9rm', spaceId: '8k0h54kbe6bj' },
    {
      ...role,
      policies: [
        {
          effect: 'allow',
          actions: [
            'read',
            'update',
            'delete',
            'archive',
            'unarchive',
            'publish',
            'unpublish',
          ],
          constraint: {
            and: [
              {
                equals: [{ doc: 'sys.type' }, 'Entry'],
              },
              {
                equals: [{ doc: 'sys.contentType.sys.id' }, 'article'],
              },
              {
                or: [
                  {
                    in: [{ doc: 'metadata.tags.sys.id' }, ['owner-test-team']],
                  },
                  {
                    equals: [{ doc: 'sys.createdBy.sys.id' }, 'User.current()'],
                  },
                ],
              },
            ],
          },
        },
        {
          effect: 'allow',
          actions: [
            'read',
            'update',
            'delete',
            'archive',
            'unarchive',
            'publish',
            'unpublish',
          ],
          constraint: {
            and: [
              {
                equals: [{ doc: 'sys.type' }, 'Entry'],
              },
              {
                equals: [{ doc: 'sys.contentType.sys.id' }, 'subArticle'],
              },
            ],
          },
        },
      ],
    },
  )
}
