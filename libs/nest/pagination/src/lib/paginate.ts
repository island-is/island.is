// SEQUELIZE CURSOR PAGINATION
// taken from here https://github.com/Kaltsoon/sequelize-cursor-pagination

import { Op } from 'sequelize'

const parseCursor = (cursor: string | null) => {
  if (!cursor) {
    return null
  }

  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'))
  } catch (e) {
    return null
  }
}

const normalizePrimaryKeyField = (primaryKeyField: any) => {
  return Array.isArray(primaryKeyField) ? primaryKeyField : [primaryKeyField]
}

const ensurePrimaryKeyFieldInOrder = (order: any[], primaryKeyField: any[]) => {
  const missingPrimaryKeyFields = primaryKeyField.filter(
    (pkField: any) => !order.find(([field]) => field === pkField),
  )

  return [
    ...order,
    ...missingPrimaryKeyFields.map((field: any) => [field, 'ASC']),
  ]
}

const normalizeOrder = (order: any[], primaryKeyField: string) => {
  const normalizedPrimaryKeyField = normalizePrimaryKeyField(primaryKeyField)

  let normalized = []

  if (Array.isArray(order)) {
    normalized = order.map((o) => {
      if (typeof o === 'string') {
        return [o, 'ASC']
      }

      if (Array.isArray(o)) {
        const [field, direction] = o

        return [field, direction || 'ASC']
      }

      return o
    })
  }

  return ensurePrimaryKeyFieldInOrder(normalized, normalizedPrimaryKeyField)
}

const reverseOrder = (order: any[]) => {
  return order.map(([field, direction]) => [
    field,
    direction.toLowerCase() === 'desc' ? 'ASC' : 'DESC',
  ])
}

const serializeCursor = (payload: any) => {
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

const createCursor = (instance: { [x: string]: any }, order: any[]) => {
  const payload = order.map(([field]) => instance[field])

  return serializeCursor(payload)
}

const isValidCursor = (cursor: string | any[], order: string | any[]) => {
  return cursor.length === order.length
}

const recursivelyGetPaginationQuery = (
  order: string | any[],
  cursor: string | any[],
): any => {
  const currentOp = order[0][1].toLowerCase() === 'desc' ? Op.lt : Op.gt

  if (order.length === 1) {
    return {
      [order[0][0]]: {
        [currentOp]: cursor[0],
      },
    }
  } else {
    return {
      [Op.or]: [
        {
          [order[0][0]]: {
            [currentOp]: cursor[0],
          },
        },
        {
          [order[0][0]]: cursor[0],
          ...recursivelyGetPaginationQuery(order.slice(1), cursor.slice(1)),
        },
      ],
    }
  }
}

const getPaginationQuery = (order: any[], cursor: any) => {
  if (!isValidCursor(cursor, order)) {
    return null
  }

  return recursivelyGetPaginationQuery(order, cursor)
}

export interface PaginateInput {
  Model: any
  primaryKeyField: string
  orderOption: any
  where?: any
  attributes?: any
  after: string
  before?: string
  limit: number
  distinctCol?: string
  [key: string]: any
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string
  endCursor: string
}

export async function paginate<T = any>({
  Model,
  primaryKeyField,
  orderOption,
  where = {},
  after,
  before,
  limit,
  attributes,
  distinctCol,
  ...queryArgs
}: PaginateInput): Promise<{
  totalCount: number
  data: T[]
  pageInfo: PageInfo
}> {
  let order = normalizeOrder(orderOption, primaryKeyField)

  order = before ? reverseOrder(order) : order

  const cursor = after
    ? parseCursor(after)
    : before
    ? parseCursor(before)
    : null

  const paginationQuery = cursor ? getPaginationQuery(order, cursor) : null

  const paginationWhere = paginationQuery
    ? { [Op.and]: [paginationQuery, where] }
    : where

  const paginationQueryOptions = {
    where: paginationWhere,
    limit,
    order,
    attributes,
    ...queryArgs,
  }

  const totalCountQueryOptions = {
    where,
    ...queryArgs,
    distinct: true,
    ...(distinctCol && { col: distinctCol }),
  }

  const cursorCountQueryOptions = {
    where: paginationWhere,
    ...queryArgs,
    distinct: true,
    ...(distinctCol && { col: distinctCol }),
  }

  const [instances, totalCount, cursorCount] = await Promise.all([
    Model.findAll(paginationQueryOptions),
    Model.count(totalCountQueryOptions),
    Model.count(cursorCountQueryOptions),
  ])

  if (before) {
    instances.reverse()
  }

  const remaining = cursorCount - instances.length

  const hasNextPage =
    (!before && remaining > 0) ||
    (Boolean(before) && totalCount - cursorCount > 0)

  const hasPreviousPage =
    (Boolean(before) && remaining > 0) ||
    (!before && totalCount - cursorCount > 0)

  const edges = instances.map((node: any) => ({
    node,
    cursor: createCursor(node, order),
  }))
  //flatten list
  const data = instances.map((node: any) => node)

  const pageInfo = {
    hasNextPage,
    hasPreviousPage,
    startCursor: edges.length > 0 ? edges[0].cursor : null,
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
  }

  return {
    totalCount,
    data,
    pageInfo,
  }
}
