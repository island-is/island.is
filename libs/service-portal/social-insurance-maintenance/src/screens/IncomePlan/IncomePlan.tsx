import { Box, Inline, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  FootNote,
  IntroHeader,
  LinkButton,
  m as coreMessages,
  formatDate,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { useGetIncomePlanQuery } from './IncomePlan.generated'
import { Problem } from '@island.is/react-spa/shared'
import parseISO from 'date-fns/parseISO'
import { SocialInsuranceMaintenancePaths } from '../../lib/paths'

const IncomePlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetIncomePlanQuery()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(coreMessages.paymentPlan)}
        intro={formatMessage(coreMessages.incomePlanDescription)}
        serviceProviderSlug={'tryggingastofnun'}
        serviceProviderTooltip={formatMessage(
          coreMessages.socialInsuranceTooltip,
        )}
      />

      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : !error && !loading && !data?.socialInsuranceIncomePlan ? (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(coreMessages.noData)}
          message={formatMessage(coreMessages.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      ) : (
        <Stack space={2}>
          <Inline space={2}>
            <LinkButton
              to="bleble"
              text="Hvað er tekjuáætlun?"
              icon="open"
              variant="utility"
            />
            <LinkButton
              to="bloblo"
              text="Breyta tekjuáætlun"
              icon="open"
              variant="utility"
            />
          </Inline>
          <ActionCard
            image={{
              type: 'image',
              url: './assets/images/tr.svg',
            }}
            text={
              data?.socialInsuranceIncomePlan?.registrationDate
                ? `${formatMessage(coreMessages.approved)}: ${formatDate(
                    parseISO(data?.socialInsuranceIncomePlan?.registrationDate),
                  )}`
                : formatMessage(coreMessages.approved)
            }
            heading={formatMessage(coreMessages.paymentPlan)}
            cta={{
              label: formatMessage(m.viewIncomePlan),
              url: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlanDetail,
              variant: 'text',
            }}
            tag={{
              label: formatMessage(coreMessages.approved),
              variant: 'mint',
              outlined: false,
            }}
          />
        </Stack>
      )}
      <FootNote serviceProviderSlug="tryggingastofnun" />
    </Box>
  )
}

export default IncomePlan
