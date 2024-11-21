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

export const LandlordInfoSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const landlordsWithoutRepresentatives = answers.landlordInfo.table.filter(
    (landlord) =>
      !landlord.isRepresentative || landlord.isRepresentative.length === 0,
  )

  return (
    <SummarySection
      sectionLabel={
        landlordsWithoutRepresentatives.length > 1
          ? formatMessage(summary.landlordsHeaderPlural)
          : formatMessage(summary.landlordsHeader)
      }
    >
      {landlordsWithoutRepresentatives.map((landlord) => {
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
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <KeyValue label={summary.emailLabel} value={landlord.email} />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <KeyValue
                  label={summary.phoneNumberLabel}
                  value={formatPhoneNumber(landlord.phone || '-')}
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
