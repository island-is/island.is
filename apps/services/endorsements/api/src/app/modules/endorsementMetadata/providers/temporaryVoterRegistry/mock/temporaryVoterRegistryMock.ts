import * as faker from 'faker'
import { rest } from 'msw'

const voterRegistryDomain = 'http://localhost:4248'
const voterRegistryUrl = (path: string) =>
  new URL(path, voterRegistryDomain).toString()
export const handlers = [
  rest.get(voterRegistryUrl('/voter-registry/system'), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        regionNumber: faker.random.number({ min: 1, max: 6 }),
        regionName: faker.lorem.words(2),
      }),
    )
  }),
]
