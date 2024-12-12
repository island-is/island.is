import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { summary } from '../../lib/messages'
import { formatNationalId, formatPhoneNumber } from '../../lib/utils'
import { KeyValue } from './KeyValue'
import { SummaryCard } from './components/SummaryCard'
import { SummaryCardRow } from './components/SummaryCardRow'
import { Routes } from '../../lib/constants'
import { FieldBaseProps } from '@island.is/application/types'
import { RentalAgreement } from '../../lib/dataSchema'

export const ApplicantsSummary = ({
  application,
  goToScreen,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const answers = application.answers as RentalAgreement

  const landlordListWithoutRepresentatives = answers.landlordInfo.table.filter(
    (landlord) =>
      !landlord.isRepresentative || landlord.isRepresentative.length === 0,
  )

  const tenantListWithoutRepresentatives = answers.tenantInfo.table.filter(
    (tenant) =>
      !tenant.isRepresentative || tenant.isRepresentative.length === 0,
  )

  return (
    <>
      <SummaryCard
        cardLabel={
          landlordListWithoutRepresentatives &&
          landlordListWithoutRepresentatives.length > 1
            ? formatMessage(summary.landlordsHeaderPlural)
            : formatMessage(summary.landlordsHeader)
        }
      >
        {landlordListWithoutRepresentatives?.map((landlord) => {
          return (
            <SummaryCardRow
              key={landlord.nationalIdWithName?.nationalId}
              editAction={goToScreen}
              route={Routes.LANDLORDINFORMATION}
            >
              <GridColumn span={['12/12']}>
                <KeyValue
                  labelVariant="h5"
                  labelAs="p"
                  label={landlord.nationalIdWithName?.name as string}
                  value={`${formatMessage(
                    summary.nationalIdLabel,
                  )}${formatNationalId(
                    landlord.nationalIdWithName?.nationalId || '-',
                  )}`}
                  gap={'smallGutter'}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <KeyValue
                  label={summary.emailLabel}
                  value={landlord.email || ''}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <KeyValue
                  label={summary.phoneNumberLabel}
                  value={formatPhoneNumber(landlord.phone || '-')}
                />
              </GridColumn>
            </SummaryCardRow>
          )
        })}
      </SummaryCard>

      <SummaryCard
        cardLabel={
          tenantListWithoutRepresentatives.length > 1
            ? formatMessage(summary.tenantsHeaderPlural)
            : formatMessage(summary.tenantsHeader)
        }
      >
        {tenantListWithoutRepresentatives.map((tenant) => {
          return (
            <SummaryCardRow
              key={tenant.nationalIdWithName?.nationalId}
              editAction={goToScreen}
              route={Routes.TENANTINFORMATION}
            >
              <GridColumn span={['12/12']}>
                <KeyValue
                  labelVariant="h5"
                  labelAs="p"
                  label={tenant.nationalIdWithName?.name as string}
                  value={`${formatMessage(
                    summary.nationalIdLabel,
                  )}${formatNationalId(
                    tenant.nationalIdWithName?.nationalId || '-',
                  )}`}
                  gap={'smallGutter'}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <KeyValue
                  label={summary.emailLabel}
                  value={tenant.email || '-'}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <KeyValue
                  label={summary.phoneNumberLabel}
                  value={formatPhoneNumber(tenant.phone || '-')}
                />
              </GridColumn>
            </SummaryCardRow>
          )
        })}
      </SummaryCard>
    </>
  )
}
