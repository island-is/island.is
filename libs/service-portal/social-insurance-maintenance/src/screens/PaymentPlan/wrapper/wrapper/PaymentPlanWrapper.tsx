import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import {
  IntroHeader,
  TabNavigation,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { m } from '../../../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { ApolloError } from '@apollo/client'
import { socialInsuranceMaintenanceNavigation } from '../../../../lib/navigation'

type Props = {
  children: React.ReactNode
  error?: ApolloError
  loading: boolean
  pathname?: string
}

export const PaymentPlanWrapper = ({
  children,
  error,
  loading,
  pathname,
}: Props) => {
  const { formatMessage } = useLocale()

  if (error && !loading) {
    return <Problem type="internal_service_error" error={error} />
  }
  return (
    <Box>
      <IntroHeader
        title={formatMessage(coreMessages.socialInsuranceMaintenance)}
        intro={formatMessage(
          coreMessages.socialInsuranceMaintenanceDescription,
        )}
        serviceProviderSlug={'tryggingastofnun'}
        serviceProviderTooltip={formatMessage(
          coreMessages.socialInsuranceTooltip,
        )}
      />
      <TabNavigation
        label={formatMessage(m.paymentPlan)}
        pathname={pathname}
        items={
          socialInsuranceMaintenanceNavigation.children?.find(
            (itm) => itm.name === coreMessages.paymentPlan,
          )?.children ?? []
        }
      />
      {!loading && !error && children && <Box marginTop={[6]}>{children}</Box>}
    </Box>
  )
}
