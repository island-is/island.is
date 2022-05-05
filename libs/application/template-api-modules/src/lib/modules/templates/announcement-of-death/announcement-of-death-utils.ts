import { join } from 'path'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { SkraningaradiliDanarbusSkeyti } from '../../../../../../../clients/syslumenn/gen/fetch'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/parental-leave/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./parental-leave-assets/${file}`)
}

export function baseMapper<T>(entity: T): T {
  return {
    ...entity,
    initial: true,
  }
}
