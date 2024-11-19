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

export const ApplicantsRepresentativesSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const landlordHasRepresentatives = answers.landlordInfo.table.some(
    (landlord) =>
      landlord.isRepresentative && landlord.isRepresentative.length > 0,
  )
  const tenantHasRepresentatives = answers.tenantInfo.table.some(
    (tenant) => tenant.isRepresentative && tenant.isRepresentative.length > 0,
  )

  const landlordRepresentatives = answers.landlordInfo.table.filter(
    (landlordRep) =>
      landlordRep.isRepresentative && landlordRep.isRepresentative.length > 0,
  )
  const tenantRepresentatives = answers.tenantInfo.table.filter(
    (tenantRep) =>
      tenantRep.isRepresentative && tenantRep.isRepresentative.length > 0,
  )

  if (landlordHasRepresentatives || tenantHasRepresentatives) {
    return (
      <>
        {landlordHasRepresentatives ? (
          <SummarySection
            sectionLabel={formatMessage(summary.landlordsRepresentativeLabel)}
          >
            {landlordRepresentatives.map((landlordRep) => {
              return (
                <Fragment key={crypto.randomUUID()}>
                  <GridRow className={gridRow}>
                    <GridColumn span={['12/12']}>
                      <KeyValue
                        labelVariant="h5"
                        labelAs="p"
                        label={landlordRep.name as string}
                        value={`${formatMessage(
                          summary.nationalIdLabel,
                        )}${formatNationalId(landlordRep.nationalId || '-')}`}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <KeyValue
                        label={summary.emailLabel}
                        value={landlordRep.email}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <KeyValue
                        label={summary.phoneNumberLabel}
                        value={formatPhoneNumber(landlordRep.phone || '-')}
                      />
                    </GridColumn>
                  </GridRow>
                  <div className={divider} />
                </Fragment>
              )
            })}
          </SummarySection>
        ) : (
          ''
        )}
        {tenantHasRepresentatives ? (
          <SummarySection
            sectionLabel={formatMessage(summary.tenantsRepresentativeLabel)}
          >
            {tenantRepresentatives.map((tenantRep) => {
              return (
                <Fragment key={crypto.randomUUID()}>
                  <GridRow className={gridRow}>
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
                </Fragment>
              )
            })}
          </SummarySection>
        ) : (
          ''
        )}
      </>
    )
  } else {
    return ''
  }
}
