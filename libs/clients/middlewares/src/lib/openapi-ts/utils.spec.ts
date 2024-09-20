import { FetchError } from '../FetchError'
import { Response } from '../nodeFetch'
import { dataOr204Null, dataOr404Null, data } from './utils'

describe('utils', () => {
  describe('dataOr204Null', () => {
    it('should return null if response status is 204', async () => {
      const promise = Promise.resolve({
        data: 'some data',
        response: { status: 204 },
      })
      const result = await dataOr204Null(promise)
      expect(result).toBeNull()
    })

    it('should return data if response status is not 204', async () => {
      const promise = Promise.resolve({
        data: 'some data',
        response: { status: 200 },
      })
      const result = await dataOr204Null(promise)
      expect(result).toBe('some data')
    })
  })

  describe('dataOr404Null', () => {
    it('should return data if promise resolves', async () => {
      const promise = Promise.resolve({ data: 'some data' })
      const result = await dataOr404Null(promise)
      expect(result).toBe('some data')
    })

    it('should return null if promise rejects with 404 FetchError', async () => {
      const error = await FetchError.build(new Response('', { status: 404 }))
      const promise = Promise.reject(error)
      const result = await dataOr404Null(promise)
      expect(result).toBeNull()
    })
  })

  describe('data', () => {
    it('should return data if promise resolves', async () => {
      const promise = Promise.resolve({ data: 'some data' })
      const result = await data(promise)
      expect(result).toBe('some data')
    })
  })
})
