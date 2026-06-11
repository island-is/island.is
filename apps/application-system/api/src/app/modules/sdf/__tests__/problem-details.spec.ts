import { createSdfProblem } from '../problem-details'

describe('SDF problem details', () => {
  it('creates an RFC7807-compatible problem details payload', () => {
    expect(
      createSdfProblem({
        type: 'https://island.is/problems/application-system/sdf/bad-request',
        title: 'Bad request',
        status: 400,
        detail: 'step must be a non-negative integer',
        instance: '/sdf/application-id/screen',
      }),
    ).toEqual({
      type: 'https://island.is/problems/application-system/sdf/bad-request',
      title: 'Bad request',
      status: 400,
      detail: 'step must be a non-negative integer',
      instance: '/sdf/application-id/screen',
    })
  })
})
