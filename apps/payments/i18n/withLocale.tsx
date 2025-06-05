import { withLocale as baseWithLocale } from '@island.is/localization'

export const withLocale = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return baseWithLocale(['payments'])(Component)
}
