import { ApplicationContext } from '@island.is/application/core'

export function returnTrueValue(context: ApplicationContext) {
  console.log(context)
  return true
}
