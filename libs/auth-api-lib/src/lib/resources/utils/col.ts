import snakeCase from 'lodash/snakeCase'

const JOIN_SEPARATOR = '->'
const COL_SEPARATOR = '.'

/**
 * Returns root-level column references like this:
 * $association->nestedAssociation.column_name$
 * @param args
 */
export function col(...args: [...Array<string | undefined>, string]): string {
  let result = ''
  for (let i = 0; i < args.length; i++) {
    const isColumn = i === args.length - 1
    const name = args[i]
    if (name) {
      if (result) {
        result += isColumn ? COL_SEPARATOR : JOIN_SEPARATOR
      } else if (isColumn) {
        return snakeCase(name)
      }
      result += isColumn ? snakeCase(name) : name
    }
  }
  return `$${result}$`
}
