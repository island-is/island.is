import { withLocale as baseWithLocale } from '@island.is/localization'

export const withLocale = (Component) => {
  return baseWithLocale(['payments'])(Component)
}
