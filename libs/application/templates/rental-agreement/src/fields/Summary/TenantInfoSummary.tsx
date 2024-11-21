import { Fragment } from 'react'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { divider, gridRow } from './summaryStyles.css'
import { KeyValue } from './KeyValue'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '../../lib/utils'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { SummarySection } from './SummarySection'

type Props = {
  answers: RentalAgreement
}

export const TenantInfoSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const tenantsWithoutRepresentatives = answers.tenantInfo.table.filter(
    (tenant) =>
      !tenant.isRepresentative || tenant.isRepresentative.length === 0,
  )

  return (
    <SummarySection
      sectionLabel={
        answers.tenantInfo.table.length > 1
          ? formatMessage(summary.tenantsHeaderPlural)
          : formatMessage(summary.tenantsHeader)
      }
    >
      {tenantsWithoutRepresentatives.map((tenant) => {
        return (
          <Fragment key={crypto.randomUUID()}>
            <GridRow className={gridRow}>
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
                <KeyValue label={summary.emailLabel} value={tenant.email} />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <KeyValue
                  label={summary.phoneNumberLabel}
                  value={formatPhoneNumber(tenant.phone || '-')}
                />
              </GridColumn>
            </GridRow>
            <div className={divider} />
          </Fragment>
        )
      })}
    </SummarySection>
  )
}
