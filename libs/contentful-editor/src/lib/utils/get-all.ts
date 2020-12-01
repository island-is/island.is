import { Asset } from 'contentful-management/dist/typings/entities/asset'
import { Entry } from 'contentful-management/dist/typings/entities/entry'
import { Environment } from 'contentful-management/dist/typings/entities/environment'

interface Stats<T> {
  length: number
  remainingToFetch: number
  items: T[]
}

export const getAllEntries = async (
  client: Environment,
  stats: Stats<Entry>,
) => {
  return await getAll('getEntries', client, stats)
}

export const getAllAssets = async (
  client: Environment,
  stats: Stats<Asset>,
) => {
  return await getAll('getAssets', client, stats)
}

export const getAll = async <T>(
  method: keyof Environment,
  client: Environment,
  stats: Stats<T>,
): Promise<T[]> => {
  const res = await (client as any)?.[method]({ skip: stats.length })
  const { total, skip } = res
  const remainingToFetch = total - skip

  if (remainingToFetch > 0) {
    stats.length = stats.length + res.items.length
    stats.remainingToFetch = remainingToFetch
    stats.items = stats.items.concat(res.items)

    await getAll(method, client, stats)
  }

  return stats.items
}
