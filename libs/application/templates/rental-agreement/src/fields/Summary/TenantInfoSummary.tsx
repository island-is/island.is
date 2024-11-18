import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { divider, gridRow, summarySection } from './summaryStyles.css'
import { KeyValue } from './KeyValue'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '../../lib/utils'
import { formatPhoneNumber } from '@island.is/application/ui-components'

type Props = {
  answers: RentalAgreement
}

export const TenantInfoSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const hasRepresentatives = answers.tenantInfo.table.some(
    (tenant) => tenant.isRepresentative && tenant.isRepresentative.length > 0,
  )

  return (
    <>
      <Text variant="h5" as="h3">
        {formatMessage(summary.tenantsHeader)}
      </Text>
      <Box className={summarySection}>
        {answers.tenantInfo.table.length > 0 &&
          answers.tenantInfo.table
            .filter(
              (tenant) =>
                !tenant.isRepresentative ||
                tenant.isRepresentative.length === 0,
            )
            .map((tenant, index) => {
              return (
                <>
                  <GridRow
                    key={`${index}_${tenant.nationalId}`}
                    className={gridRow}
                  >
                    <GridColumn span={['12/12']}>
                      <KeyValue
                        labelVariant="h5"
                        labelAs="p"
                        label={tenant.name as string}
                        value={`${formatMessage(
                          summary.nationalIdLabel,
                        )}${formatNationalId(tenant.nationalId || '-')}`}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <KeyValue
                        label={summary.emailLabel}
                        value={tenant.email}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <KeyValue
                        label={summary.phoneNumberLabel}
                        value={formatPhoneNumber(tenant.phone || '-')}
                      />
                    </GridColumn>
                  </GridRow>
                  <div className={divider} />
                </>
              )
            })}
      </Box>

      {hasRepresentatives ? (
        <>
          <Text variant="h5" as="h3">
            {formatMessage(summary.tenantsRepresentativeLabel)}
          </Text>
          <Box className={summarySection}>
            {answers.tenantInfo.table
              .filter(
                (tenantRep) =>
                  tenantRep.isRepresentative &&
                  tenantRep.isRepresentative.length > 0,
              )
              .map((tenantRep, index) => {
                return (
                  <>
                    <GridRow
                      key={`${index}_${tenantRep.nationalId}`}
                      className={gridRow}
                    >
                      <GridColumn span={['12/12']}>
                        <KeyValue
                          labelVariant="h5"
                          labelAs="p"
                          label={tenantRep.name as string}
                          value={`${formatMessage(
                            summary.nationalIdLabel,
                          )}${formatNationalId(tenantRep.nationalId || '-')}`}
                        />
                      </GridColumn>
                      <GridColumn span={['12/12', '6/12']}>
                        <KeyValue
                          label={summary.emailLabel}
                          value={tenantRep.email}
                        />
                      </GridColumn>
                      <GridColumn span={['12/12', '6/12']}>
                        <KeyValue
                          label={summary.phoneNumberLabel}
                          value={formatPhoneNumber(tenantRep.phone || '-')}
                        />
                      </GridColumn>
                    </GridRow>
                    <div className={divider} />
                  </>
                )
              })}
          </Box>
        </>
      ) : (
        ''
      )}
    </>
  )
}
