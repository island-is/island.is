import { Environment } from 'contentful-management/dist/typings/entities/environment'

export const getAll = async <T>(
  method: keyof Environment,
  client: Environment,
): Promise<T[]> => {
  let skip = 0
  let array: T[] = []
  let done = false

  const run = async () => {
    const res = await (client as any)[method]({ skip })
    const { items, total, limit } = res

    done = total - skip <= limit
    skip = skip + items.length
    array.push(...items)

    if (!done) {
      await run()
    }
  }

  await run()

  return array
}
