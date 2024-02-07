import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
  SJUKRATRYGGINGAR_SLUG,
  TabNavigation,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'
import { ApolloError } from '@apollo/client'
import { Problem } from '@island.is/react-spa/shared'

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

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.therapyTitle)}
        intro={formatMessage(messages.therapyDescription)}
        serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
        serviceProviderTooltip={formatMessage(messages.healthTooltip)}
      />
      <TabNavigation
        label={formatMessage(messages.therapyTitle)}
        pathname={pathname}
        items={
          healthNavigation.children?.find((itm) => itm.name === m.therapies)
            ?.children ?? []
        }
      />
      {error && !loading && (
        <Box paddingY={4}>
          <Problem
            size="small"
            noBorder={false}
            type="internal_service_error"
            error={error}
          />
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
    </Box>
  )
}
