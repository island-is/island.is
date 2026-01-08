import {
  Inline,
  Stack,
  Button,
  Table as T,
  Hidden,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyTable,
  IntroWrapper,
  LinkButton,
  amountFormat,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { useGetIncomePlanDetailQuery } from './IncomePlanDetail.generated'
import { Problem } from '@island.is/react-spa/shared'

const IncomePlanDetail = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetIncomePlanDetailQuery()
  return (
    <IntroWrapper
      title={formatMessage(coreMessages.latestIncomePlan)}
      intro={formatMessage(m.incomePlanDetail)}
      serviceProviderSlug={'tryggingastofnun'}
      serviceProviderTooltip={formatMessage(
        coreMessages.socialInsuranceTooltip,
      )}
      childrenWidthFull
    >
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
          <Hidden print>
            {!loading &&
              !error &&
              !data?.socialInsuranceIncomePlan?.isEligibleForChange
                .isEligible && (
                <AlertMessage
                  type="info"
                  title={formatMessage(m.incomePlanModifyUnavailable)}
                  message={formatMessage(m.incomePlanModifyUnavailableText)}
                />
              )}
          </Hidden>
          <Hidden print>
            <Inline space={2}>
              <Button
                variant="utility"
                size="small"
                onClick={() => window.print()}
                icon="print"
                iconType="filled"
              >
                {formatMessage(coreMessages.print)}
              </Button>
              <LinkButton
                to={`${document.location.origin}/${formatMessage(
                  m.incomePlanModifyLink,
                )}`}
                text={formatMessage(m.modifyIncomePlan)}
                disabled={
                  !data?.socialInsuranceIncomePlan?.isEligibleForChange
                    .isEligible
                }
                icon="open"
                variant="primary"
                size="small"
              />
            </Inline>
          </Hidden>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(m.incomeType)}</T.HeadData>
                <T.HeadData>{formatMessage(m.annualIncome)}</T.HeadData>
                <T.HeadData>{formatMessage(m.currency)}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {data?.socialInsuranceIncomePlan &&
                !loading &&
                !error &&
                data.socialInsuranceIncomePlan.incomeCategories.map(
                  (category, index) => (
                    <T.Row key={index}>
                      <T.Data>{category.typeName}</T.Data>
                      <T.Data>{amountFormat(category.annualSum)}</T.Data>
                      <T.Data>{category.currency}</T.Data>
                    </T.Row>
                  ),
                )}
            </T.Body>
          </T.Table>
          {!data?.socialInsuranceIncomePlan?.incomeCategories && (
            <EmptyTable
              loading={loading}
              message={formatMessage(m.noPaymentsFound)}
            />
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default IncomePlanDetail
