import { Fragment } from 'react'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { formatNationalId } from '../../lib/utils'
import { KeyValue } from './KeyValue'
import { SummarySection } from './SummarySection'
import { Divider } from './Divider'
import { gridRow } from './summaryStyles.css'

type Props = {
  answers: RentalAgreement
}

export const ApplicantsSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

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
      <SummarySection
        sectionLabel={
          landlordListWithoutRepresentatives.length > 1
            ? formatMessage(summary.landlordsHeaderPlural)
            : formatMessage(summary.landlordsHeader)
        }
      >
        {landlordListWithoutRepresentatives.map((landlord) => {
          return (
            <Fragment key={crypto.randomUUID()}>
              <GridRow className={gridRow}>
                <GridColumn span={['12/12']}>
                  <KeyValue
                    labelVariant="h5"
                    labelAs="p"
                    label={landlord.name as string}
                    value={`${formatMessage(
                      summary.nationalIdLabel,
                    )}${formatNationalId(landlord.nationalId || '-')}`}
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
              </GridRow>
              <Divider />
            </Fragment>
          )
        })}
      </SummarySection>

      <SummarySection
        sectionLabel={
          tenantListWithoutRepresentatives.length > 1
            ? formatMessage(summary.tenantsHeaderPlural)
            : formatMessage(summary.tenantsHeader)
        }
      >
        {tenantListWithoutRepresentatives.map((tenant) => {
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
              </GridRow>
              <Divider />
            </Fragment>
          )
        })}
      </SummarySection>
    </>
  )
}
