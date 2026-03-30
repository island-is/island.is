import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapperV2 } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages } from '../../../lib/messages/unemployment'
import { useGetUnemploymentApplicationOverviewQuery } from './Status.generated'

const Status = () => {
  useNamespaces('sp.social-benefits-unemployment')
  const { formatMessage, locale } = useLocale()
  const { data, loading, error } = useGetUnemploymentApplicationOverviewQuery()
  console.log(data)
  console.log(error)
  return (
    <IntroWrapperV2
      title={formatMessage(unemploymentBenefitsMessages.title)}
      intro={formatMessage(unemploymentBenefitsMessages.intro)}
      serviceProvider={{
        slug: 'vinnumalastofnun',
        tooltip: formatMessage(unemploymentBenefitsMessages.tooltip),
      }}
    />
  )
}

export default Status
