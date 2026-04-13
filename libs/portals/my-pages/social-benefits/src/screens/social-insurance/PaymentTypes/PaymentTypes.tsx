import { Button, Stack, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatNationalId,
  IntroWrapper,
  LinkResolver,
  m as coreMessages,
  TRYGGINGASTOFNUN_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { m } from '../../../lib/messages'
import {
  useGetPaymentTypesQuery,
  useGetChildBenefitsQuery,
} from './PaymentTypes.generated'

const PaymentTypes = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage, formatDate, lang } = useLocale()

  const {
    data: paymentTypesData,
    loading: paymentTypesLoading,
    error: paymentTypesError,
  } = useGetPaymentTypesQuery({
    variables: { locale: lang },
    fetchPolicy: 'no-cache',
  })

  const {
    data: childBenefitsData,
    loading: childBenefitsLoading,
    error: childBenefitsError,
  } = useGetChildBenefitsQuery()

  const paymentTypes = paymentTypesData?.socialInsurancePaymentTypes
  const childBenefits = childBenefitsData?.socialInsuranceChildBenefits

  const buttonGroup = [
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
  ]

  return (
    <IntroWrapper
      title={formatMessage(m.paymentTypesOverview)}
      intro={formatMessage(m.paymentTypesOverviewDescription)}
      serviceProviderSlug={TRYGGINGASTOFNUN_SLUG}
      serviceProviderTooltip={formatMessage(
        coreMessages.socialInsuranceTooltip,
      )}
      buttonGroup={buttonGroup}
    >
      <Stack space={6}>
        {paymentTypesLoading ? (
          <CardLoader />
        ) : paymentTypesError ? (
          <Problem error={paymentTypesError} noBorder={false} />
        ) : !paymentTypes?.length ? (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noPaymentTypesFound)}
            message={formatMessage(coreMessages.noDataFoundDetail)}
            imgSrc="./assets/images/nodata.svg"
          />
        ) : (
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
                {paymentTypes.map((item, index) => (
                  <T.Row key={`${item.name}-${index}`}>
                    <T.Data>{item.name ?? '-'}</T.Data>
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

        {childBenefitsLoading ? (
          <CardLoader />
        ) : childBenefitsError ? (
          <Problem error={childBenefitsError} noBorder={false} />
        ) : childBenefits && childBenefits.length > 0 ? (
          <Stack space={2}>
            <Text variant="eyebrow" color="purple400">
              {formatMessage(m.childBenefitsSectionTitle)}
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
                {childBenefits.map((child, index) => (
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
        ) : null}
      </Stack>
    </IntroWrapper>
  )
}

export default PaymentTypes
