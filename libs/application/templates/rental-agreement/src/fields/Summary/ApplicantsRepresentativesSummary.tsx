import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { formatNationalId, formatPhoneNumber } from '../../lib/utils'
import { KeyValue } from './KeyValue'
import { SummarySection } from './SummarySection'
import { FieldBaseProps } from '@island.is/application/types'
import { SummaryCardRow } from './components/SummaryCardRow'
import { Routes } from '../../lib/constants'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  landlordsRoute?: Routes
  tenantsRoute?: Routes
}

export const ApplicantsRepresentativesSummary: FC<Props> = ({ ...props }) => {
  const { formatMessage } = useLocale()
  const { application, goToScreen, landlordsRoute, tenantsRoute } = props
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
                <SummaryCardRow
                  key={landlordRep.nationalIdWithName?.nationalId}
                  editAction={goToScreen}
                  route={landlordsRoute}
                >
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

                  <GridColumn span={['12/12', '8/12']}>
                    <KeyValue
                      label={summary.emailLabel}
                      value={landlordRep.email || '-'}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '4/12']}>
                    <KeyValue
                      label={summary.phoneNumberLabel}
                      value={formatPhoneNumber(landlordRep.phone || '-')}
                    />
                  </GridColumn>
                </SummaryCardRow>
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
                <SummaryCardRow
                  key={tenantRep.nationalIdWithName?.nationalId}
                  editAction={props.goToScreen}
                  route={tenantsRoute}
                >
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
                  <GridColumn span={['12/12', '8/12']}>
                    <KeyValue
                      label={summary.emailLabel}
                      value={tenantRep.email || '-'}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '4/12']}>
                    <KeyValue
                      label={summary.phoneNumberLabel}
                      value={formatPhoneNumber(tenantRep.phone || '-')}
                    />
                  </GridColumn>
                </SummaryCardRow>
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
