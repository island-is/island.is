import { Button, Stack, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatNationalId,
  IntroWrapper,
  LinkResolver,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { m } from '../../../lib/messages'
import { useGetPaymentTypesOverviewQuery } from './PaymentTypes.generated'

const PaymentTypes = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage, formatDate } = useLocale()

  const { data, loading, error } = useGetPaymentTypesOverviewQuery()

  const result = data?.socialInsurancePaymentTypesOverview

  const introProps = {
    title: formatMessage(m.paymentTypesOverview),
    intro: formatMessage(m.paymentTypesOverviewDescription),
    serviceProviderSlug: 'tryggingastofnun' as const,
    serviceProviderTooltip: formatMessage(coreMessages.socialInsuranceTooltip),
    buttonGroup: [
      <LinkResolver
        key="calculate-my-rights"
        href="https://island.is/s/tryggingastofnun/reiknivel"
      >
        <Button
          as="span"
          variant="utility"
          icon="open"
          iconType="outline"
          unfocusable
        >
          {formatMessage(m.calculateMyRights)}
        </Button>
      </LinkResolver>,
    ],
  }

  if (loading) {
    return (
      <IntroWrapper {...introProps}>
        <CardLoader />
      </IntroWrapper>
    )
  }

  if (error) {
    return (
      <IntroWrapper {...introProps}>
        <Problem error={error} noBorder={false} />
      </IntroWrapper>
    )
  }

  return (
    <IntroWrapper {...introProps}>
      <Stack space={6}>
        {result?.paymentTypes && result.paymentTypes.length > 0 && (
          <Stack space={2}>
            <Text variant="eyebrow" color="purple400">
              {formatMessage(m.paymentTypesSectionTitle)}
            </Text>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData box={{ background: 'blue100' }} scope="col">
                    <Text variant="medium" fontWeight="medium">
                      {formatMessage(m.paymentTypeName)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData box={{ background: 'blue100' }} scope="col">
                    <Text variant="medium" fontWeight="medium">
                      {formatMessage(m.dateFrom)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData box={{ background: 'blue100' }} scope="col">
                    <Text variant="medium" fontWeight="medium">
                      {formatMessage(m.dateTo)}
                    </Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {result.paymentTypes.map((item, index) => (
                  <T.Row key={`${item.paymentType}-${index}`}>
                    <T.Data>{item.paymentType ?? '-'}</T.Data>
                    <T.Data>
                      {item.dateFrom
                        ? formatDate(item.dateFrom, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                        : '-'}
                    </T.Data>
                    <T.Data>
                      {item.dateTo
                        ? formatDate(item.dateTo, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                        : '-'}
                    </T.Data>
                  </T.Row>
                ))}
              </T.Body>
            </T.Table>
          </Stack>
        )}

        {result?.benefitChildren && result.benefitChildren.length > 0 && (
          <Stack space={2}>
            <Text variant="eyebrow" color="purple400">
              {formatMessage(m.benefitChildrenSectionTitle)}
            </Text>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData box={{ background: 'blue100' }} scope="col">
                    <Text variant="medium" fontWeight="medium">
                      {formatMessage(m.name)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData box={{ background: 'blue100' }} scope="col">
                    <Text variant="medium" fontWeight="medium">
                      {formatMessage(m.nationalId)}
                    </Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {result.benefitChildren.map((child, index) => (
                  <T.Row key={`${child.nationalId}-${index}`}>
                    <T.Data>{child.name ?? '-'}</T.Data>
                    <T.Data>
                      {child.nationalId
                        ? formatNationalId(child.nationalId)
                        : '-'}
                    </T.Data>
                  </T.Row>
                ))}
              </T.Body>
            </T.Table>
          </Stack>
        )}
      </Stack>
    </IntroWrapper>
  )
}

export default PaymentTypes
