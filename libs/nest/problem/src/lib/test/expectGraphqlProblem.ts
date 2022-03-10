import { Response } from 'supertest'
import { Problem } from '@island.is/shared/problem'

export const expectGraphqlProblem = (
  response: Response,
  problem: Problem | undefined,
) => {
  expect(response.body.errors).toHaveLength(1)
  expect(response.body.errors[0].extensions.problem).toEqual(problem)
}
