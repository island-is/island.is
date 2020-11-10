import {
  Application,
  MaybeWithApplication,
  Option,
} from '@island.is/application/core'

export function buildOptions(
  maybeOptions: MaybeWithApplication<Option[]>,
  application: Application,
): Option[] {
  if (typeof maybeOptions === 'function') {
    return maybeOptions(application)
  }
  return maybeOptions
}
