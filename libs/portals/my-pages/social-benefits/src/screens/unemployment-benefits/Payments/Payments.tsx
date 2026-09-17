import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionButtons } from '../components/ActionButtons'
import { useGetApplicantAvailableActionsQuery } from '../MyData/MyData.generated'
import { PaymentsFromUnemploymentFund } from './tabs/PaymentsFromUnemploymentFund'
import { ReportedIncome } from './tabs/ReportedIncome'

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
        availableActions={availableActions}
        loading={actionsLoading}
      />

      <Tabs
        label={formatMessage(um.paymentsTitle)}
        contentBackground="white"
        onlyRenderSelectedTab
        selected="payments"
        tabs={[
          {
            id: 'payments',
            label: formatMessage(um.paymentsTabPayments),
            content: <PaymentsFromUnemploymentFund />,
          },
          {
            id: 'reportedIncome',
            label: formatMessage(um.paymentsTabReportedIncome),
            content: <ReportedIncome />,
          },
        ]}
      />
    </IntroWrapper>
  )
}

export default Payments
