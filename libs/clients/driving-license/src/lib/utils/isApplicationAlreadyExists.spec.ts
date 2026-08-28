import { isApplicationAlreadyExists } from './isApplicationAlreadyExists'

describe('isApplicationAlreadyExists', () => {
  it('matches the temporary endpoint machine code (plain JSON body)', () => {
    expect(
      isApplicationAlreadyExists({
        status: 400,
        body: { errorCode: 'APPLICATION_ALREADY_EXISTS' },
      }),
    ).toBe(true)
  })

  it('matches the full endpoint problem+json detail', () => {
    expect(
      isApplicationAlreadyExists({
        status: 400,
        problem: {
          title: 'Bad Request',
          detail: 'An application already exists for this category',
        },
      }),
    ).toBe(true)
  })

  it.each([
    ['a different 400', { status: 400, body: { errorCode: 'HAS_POINTS' } }],
    [
      'a 400 with unrelated problem',
      { status: 400, problem: { detail: 'Nope' } },
    ],
    [
      'a 500',
      { status: 500, body: { errorCode: 'APPLICATION_ALREADY_EXISTS' } },
    ],
    ['no status', { body: { errorCode: 'APPLICATION_ALREADY_EXISTS' } }],
    ['a plain error', new Error('boom')],
    ['null', null],
    ['undefined', undefined],
  ])('does not match %s', (_label, input) => {
    expect(isApplicationAlreadyExists(input)).toBe(false)
  })
})
