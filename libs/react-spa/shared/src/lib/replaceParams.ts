import { Params } from 'react-router-dom'

type ReplaceParams = {
  href: string
  params: Params<string>
  paramsPrefix?: string
}

/**
 * Replace params in path
 * @example
 * replaceParams('/users/:id', { id: 1 }) // '/users/1'
 */
export const replaceParams = ({
  href,
  params,
  paramsPrefix = '/',
}: ReplaceParams) => {
  return href.replace(
    /\/:(\w+)/g,
    (_, paramName) => (paramsPrefix + params[paramName]) as string,
  )
}
