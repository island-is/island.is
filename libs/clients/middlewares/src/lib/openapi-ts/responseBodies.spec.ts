import { Response } from '../nodeFetch'
import {
  EmptyResponseBodyError,
  requireResponseBodies,
  toResponseBodies,
} from './responseBodies'

// A 204, or any other status with `Content-Length: 0`: what the generated client treats as empty.
const empty = (status: number) =>
  new Response('', {
    status,
    headers: status === 204 ? {} : { 'Content-Length': '0' },
  })

describe('toResponseBodies()', () => {
  it('records, for each response that can answer a 2xx, whether it declares a JSON body', () => {
    expect(
      toResponseBodies({
        '200': { mediaType: 'application/json' },
        '201': { mediaType: 'application/vnd.api+json; charset=utf-8' },
        '202': { mediaType: 'text/plain' },
        '204': {},
        '2xx': { mediaType: 'application/json' },
        '404': { mediaType: 'application/json' },
        '4XX': { mediaType: 'application/json' },
        default: { mediaType: 'application/problem+json' },
      }),
    ).toEqual({
      '200': true,
      '201': true,
      '202': false,
      '204': false,
      '2XX': true,
      default: true,
    })
  })
})

describe('requireResponseBodies()', () => {
  const check = requireResponseBodies({
    'GET /items/{id}': { '200': true, '204': false },
    'POST /items': { '2XX': true },
    'DELETE /items/{id}': { default: true },
  })
  const getItem = { method: 'GET', url: '/items/{id}' }

  it('throws on an empty response whose status declares a JSON body', () => {
    expect(() => check(empty(200), undefined, getItem)).toThrow(
      new EmptyResponseBodyError('GET /items/{id}', 200),
    )
  })

  it('allows an empty response whose status declares no body', () => {
    const response = empty(204)
    expect(check(response, undefined, getItem)).toBe(response)
  })

  it('falls back to the 2XX range, then to default', () => {
    expect(() =>
      check(empty(201), undefined, { method: 'POST', url: '/items' }),
    ).toThrow(EmptyResponseBodyError)
    expect(() =>
      check(empty(204), undefined, { method: 'delete', url: '/items/{id}' }),
    ).toThrow(EmptyResponseBodyError)
  })

  it('allows an empty response for a status the document does not cover', () => {
    const response = empty(202)
    expect(check(response, undefined, getItem)).toBe(response)
  })

  it('passes a response with a body through', () => {
    const response = new Response('{}', {
      status: 200,
      headers: { 'Content-Length': '2' },
    })
    expect(check(response, undefined, getItem)).toBe(response)
  })

  it('passes responses for operations it does not know through', () => {
    const response = empty(200)
    expect(check(response, undefined, { method: 'GET', url: '/unknown' })).toBe(
      response,
    )
  })

  it('ignores non-2xx responses', () => {
    const response = new Response('', {
      status: 404,
      headers: { 'Content-Length': '0' },
    })
    expect(check(response, undefined, getItem)).toBe(response)
  })

  it('allows an empty body when the call opts out', () => {
    const response = empty(200)
    expect(
      check(response, undefined, {
        ...getItem,
        meta: { allowEmptyResponseBody: true },
      }),
    ).toBe(response)
  })
})
