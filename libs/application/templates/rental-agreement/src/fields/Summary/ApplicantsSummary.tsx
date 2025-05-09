import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { Routes } from '../../utils/enums'
import {
  filterRepresentativesFromApplicants,
  formatNationalId,
  formatPhoneNumber,
} from '../../utils/utils'
import { KeyValue } from './components/KeyValue'
import { SummaryCard } from './components/SummaryCard'
import { SummaryCardRow } from './components/SummaryCardRow'
import { summary } from '../../lib/messages'
import { ApplicantsInfo } from '../../utils/types'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  landlordsRoute?: Routes
  tenantsRoute?: Routes
  hasChangeButton: boolean
}

export const ApplicantsSummary: FC<Props> = ({ ...props }) => {
  const { formatMessage } = useLocale()
  const {
    application,
    goToScreen,
    landlordsRoute,
    tenantsRoute,
    hasChangeButton,
  } = props
  const { answers } = application

  const landlords = getValueViaPath<ApplicantsInfo[]>(
    answers,
    'landlordInfo.table',
    [],
  )
  const tenants = getValueViaPath<ApplicantsInfo[]>(
    answers,
    'tenantInfo.table',
    [],
  )

  const landlordListWithoutRepresentatives =
    filterRepresentativesFromApplicants(landlords)
  const tenantListWithoutRepresentatives =
    filterRepresentativesFromApplicants(tenants)

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
              route={landlordsRoute}
              hasChangeButton={hasChangeButton}
            >
              <GridColumn span={['12/12']}>
                <KeyValue
                  labelVariant="h5"
                  labelAs="p"
                  label={landlord.nationalIdWithName?.name ?? ''}
                  value={`${formatMessage(
                    summary.nationalIdLabel,
                  )}${formatNationalId(
                    landlord.nationalIdWithName?.nationalId || '',
                  )}`}
                  gap={'smallGutter'}
                />
              </GridColumn>
              <GridColumn span={['12/12', '8/12']}>
                <KeyValue
                  label={summary.emailLabel}
                  value={landlord.email || ''}
                />
              </GridColumn>
              <GridColumn span={['12/12', '4/12']}>
                <KeyValue
                  label={summary.phoneNumberLabel}
                  value={formatPhoneNumber(landlord.phone || '')}
                />
              </GridColumn>
            </SummaryCardRow>
          )
        })}
      </SummaryCard>

      {tenantListWithoutRepresentatives && (
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
                route={tenantsRoute}
                hasChangeButton={hasChangeButton}
              >
                <GridColumn span={['12/12']}>
                  <KeyValue
                    labelVariant="h5"
                    labelAs="p"
                    label={tenant.nationalIdWithName?.name ?? ''}
                    value={`${formatMessage(
                      summary.nationalIdLabel,
                    )}${formatNationalId(
                      tenant.nationalIdWithName?.nationalId || '-',
                    )}`}
                    gap={'smallGutter'}
                  />
                </GridColumn>
                <GridColumn span={['12/12', '8/12']}>
                  <KeyValue
                    label={summary.emailLabel}
                    value={tenant.email || '-'}
                  />
                </GridColumn>
                <GridColumn span={['12/12', '4/12']}>
                  <KeyValue
                    label={summary.phoneNumberLabel}
                    value={formatPhoneNumber(tenant.phone || '-')}
                  />
                </GridColumn>
              </SummaryCardRow>
            )
          })}
        </SummaryCard>
      )}
    </>
  )
}
