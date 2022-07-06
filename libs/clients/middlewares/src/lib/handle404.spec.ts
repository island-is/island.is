import { handle404 } from './handle404'
import { FetchError } from './FetchError'
import { Response } from './nodeFetch'

describe('handle404()', () => {
  it('returns null if it receives a FetchError with status = 404', async () => {
    const error = await FetchError.build(new Response('', { status: 404 }))
    expect(handle404(error)).toBeNull()
  })

  it('throws other errors', () => {
    const error = new Error('Something went wrong')
    expect(() => handle404(error)).toThrow(error)
  })
})
