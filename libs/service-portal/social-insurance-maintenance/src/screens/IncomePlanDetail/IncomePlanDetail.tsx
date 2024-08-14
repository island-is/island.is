import {
  Box,
  Inline,
  Stack,
  Button,
  Table as T,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FootNote,
  IntroHeader,
  LinkButton,
  amountFormat,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { useGetIncomePlanQuery } from './IncomePlan.generated'
import { Problem } from '@island.is/react-spa/shared'

const IncomePlanDetail = () => {
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
              to="bloblo"
              text="Breyta tekjuáætlun"
              icon="open"
              variant="utility"
            />
          </Inline>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(m.incomeType)}</T.HeadData>
                <T.HeadData>{formatMessage(m.annualIncome)}</T.HeadData>
                <T.HeadData>{formatMessage(m.currency)}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {data?.socialInsuranceIncomePlan?.incomeCategories.map(
                (category, index) => (
                  <T.Row key={index}>
                    <T.Data>{category.name}</T.Data>
                    <T.Data>{amountFormat(category.annualSum)}</T.Data>
                    <T.Data>{category.currency}</T.Data>
                  </T.Row>
                ),
              )}
            </T.Body>
          </T.Table>
        </Stack>
      )}
      <FootNote serviceProviderSlug="tryggingastofnun" />
    </Box>
  )
}

export default IncomePlanDetail
