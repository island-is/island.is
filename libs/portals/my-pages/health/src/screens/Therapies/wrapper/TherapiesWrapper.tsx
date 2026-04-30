import { ApolloError } from '@apollo/client'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyState,
  IntroWrapper,
  SJUKRATRYGGINGAR_SLUG,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'
import { HealthPaths } from '../../../lib/paths'
import { useHealthPlausibleSwap } from '../../../utils/useHealthPlausibleSwap'

type Props = {
  children: React.ReactNode
  error?: ApolloError
  loading: boolean
  pathname?: string
}

export const TherapiesWrapper = ({
  children,
  error,
  loading,
  pathname,
}: Props) => {
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()

  return (
    <IntroWrapper
      marginBottom={[6, 6, 10]}
      title={formatMessage(messages.therapyTitle)}
      intro={formatMessage(messages.therapyDescription)}
      serviceProvider={{
        slug: SJUKRATRYGGINGAR_SLUG,
        tooltip: formatMessage(messages.healthTooltip),
      }}
    >
      <TabNavigation
        label={formatMessage(messages.therapyType)}
        pathname={pathname}
        items={
          healthNavigation.children
            ?.find((itm) => itm.path === HealthPaths.HealthTherapiesAndAids)
            ?.children?.find((itm) => itm.path === HealthPaths.HealthTherapies)
            ?.children ?? []
        }
      />
      {error && !loading && (
        <Box paddingY={4}>
          <Problem noBorder={false} error={error} />
        </Box>
      )}
      <Box paddingY={4}>
        {!loading && !error && !children && (
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        )}

        {!error && children && <Box>{children}</Box>}
      </Box>
    </IntroWrapper>
  )
}
