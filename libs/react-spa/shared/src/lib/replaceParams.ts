import { Params } from 'react-router-dom'

type ReplaceParams = {
  href: string
  params: Params<string>
}

/**
 * Replace params in path
 *
 * @example
 * replaceParams('/users/:id/:friend', { id: 1, friend: 'john' }) -> '/users/1/john'
 */
export function replaceParams({ href, params }: ReplaceParams) {
  return href.replace(/\/:(\w+)/g, (_, paramName) => `/${params[paramName]}`)
}
