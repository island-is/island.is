import { FC, Fragment } from 'react'
import { Button, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { formatNationalId, formatPhoneNumber } from '../../lib/utils'
import { KeyValue } from './KeyValue'
import { SummarySection } from './SummarySection'
import { Divider } from './Divider'
import { changeButton, gridRow } from './summaryStyles.css'
import { FieldBaseProps } from '@island.is/application/types'

export const ApplicantsRepresentativesSummary: FC<FieldBaseProps> = ({
  ...props
}) => {
  const { formatMessage } = useLocale()
  const { application } = props
  const answers = application.answers as RentalAgreement

  const landlordListHasRepresentatives = answers.landlordInfo.table.some(
    (landlord) =>
      landlord.isRepresentative && landlord.isRepresentative.length > 0,
  )
  const tenantListHasRepresentatives = answers.tenantInfo.table.some(
    (tenant) => tenant.isRepresentative && tenant.isRepresentative.length > 0,
  )

  const landlordRepresentatives = answers.landlordInfo.table?.filter(
    (landlordRep) =>
      landlordRep.isRepresentative && landlordRep.isRepresentative.length > 0,
  )
  const tenantRepresentatives = answers.tenantInfo.table.filter(
    (tenantRep) =>
      tenantRep.isRepresentative && tenantRep.isRepresentative.length > 0,
  )

  if (landlordListHasRepresentatives || tenantListHasRepresentatives) {
    return (
      <>
        {landlordListHasRepresentatives ? (
          <SummarySection
            sectionLabel={formatMessage(summary.landlordsRepresentativeLabel)}
          >
            {landlordRepresentatives?.map((landlordRep) => {
              return (
                <Fragment key={landlordRep.nationalIdWithName?.nationalId}>
                  <GridRow className={gridRow}>
                    <GridColumn span={['12/12']}>
                      <KeyValue
                        labelVariant="h5"
                        labelAs="p"
                        label={landlordRep.nationalIdWithName?.name as string}
                        value={`${formatMessage(
                          summary.nationalIdLabel,
                        )}${formatNationalId(
                          landlordRep.nationalIdWithName?.nationalId || '-',
                        )}`}
                        gap={'smallGutter'}
                      />
                    </GridColumn>

                    <GridColumn span={['12/12', '6/12']}>
                      <KeyValue
                        label={summary.emailLabel}
                        value={landlordRep.email || '-'}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <KeyValue
                        label={summary.phoneNumberLabel}
                        value={formatPhoneNumber(landlordRep.phone || '-')}
                      />
                    </GridColumn>

                    <div className={changeButton}>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => console.log('Open')}
                      >
                        {formatMessage(summary.changeSectionButtonLabel)}
                      </Button>
                    </div>
                  </GridRow>
                  <Divider />
                </Fragment>
              )
            })}
          </SummarySection>
        ) : (
          ''
        )}
        {tenantListHasRepresentatives ? (
          <SummarySection
            sectionLabel={formatMessage(summary.tenantsRepresentativeLabel)}
          >
            {tenantRepresentatives.map((tenantRep) => {
              return (
                <Fragment key={tenantRep.nationalIdWithName?.nationalId}>
                  <GridRow className={gridRow}>
                    <GridColumn span={['12/12']}>
                      <KeyValue
                        labelVariant="h5"
                        labelAs="p"
                        label={tenantRep.nationalIdWithName?.name as string}
                        value={`${formatMessage(
                          summary.nationalIdLabel,
                        )}${formatNationalId(
                          tenantRep.nationalIdWithName?.nationalId || '-',
                        )}`}
                        gap={'smallGutter'}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <KeyValue
                        label={summary.emailLabel}
                        value={tenantRep.email || '-'}
                      />
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12']}>
                      <KeyValue
                        label={summary.phoneNumberLabel}
                        value={formatPhoneNumber(tenantRep.phone || '-')}
                      />
                    </GridColumn>
                  </GridRow>
                  <Divider />
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
