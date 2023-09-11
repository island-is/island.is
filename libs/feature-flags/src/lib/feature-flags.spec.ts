import { createClient } from './feature-flags'
import { Client } from './configcat'

describe('Client creation and caching', () => {
  it('should retrieve the client from cache and not create a new one', async () => {
    const spy = jest.spyOn(Client, 'create')

    await createClient()
    await createClient()

    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
})
