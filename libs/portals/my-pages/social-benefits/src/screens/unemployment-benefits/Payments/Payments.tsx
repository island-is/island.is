import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionButtons } from '../components/ActionButtons'
import { useGetApplicantAvailableActionsQuery } from '../MyData/MyData.generated'
import { ReportedIncome } from './ReportedIncome'

// Atvinnuleysi – Greiðslur
const Payments = () => {
  useNamespaces('sp.social-benefits-unemployment')
  const { formatMessage } = useLocale()

  const { data: actionsData, loading: actionsLoading } =
    useGetApplicantAvailableActionsQuery()

  const availableActions = actionsData?.vmstApplicantAvailableActions

  return (
    <IntroWrapper
      title={formatMessage(um.paymentsTitle)}
      intro={formatMessage(um.paymentsIntro)}
      serviceProvider={{
        slug: 'vinnumalastofnun',
        tooltip: formatMessage(um.tooltip),
      }}
      loading={actionsLoading}
    >
      <ActionButtons
        availableActions={{
          canContact: availableActions?.canContact,
          canReportWork: availableActions?.canReportWork,
          canUnregister: availableActions?.canUnregister,
        }}
        loading={actionsLoading}
      />
      <ReportedIncome />
    </IntroWrapper>
  )
}

export default Payments
