import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { applicationAnswers } from '../../shared'
import { Routes } from '../../utils/enums'
import { formatNationalId, formatPhoneNumber } from '../../utils/utils'
import { KeyValue } from './components/KeyValue'
import { SummaryCardRow } from './components/SummaryCardRow'
import { SummaryCard } from './components/SummaryCard'
import { summary } from '../../lib/messages'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  partiesRoute?: Routes
  hasChangeButton: boolean
}

export const ApplicantsRepresentativesSummary: FC<Props> = ({ ...props }) => {
  const { formatMessage } = useLocale()
  const { application, goToScreen, partiesRoute, hasChangeButton } = props
  const { answers } = application

  const { landlordRepresentatives = [] } = applicationAnswers(answers)

  return landlordRepresentatives.length > 0 ? (
    <SummaryCard
      cardLabel={formatMessage(summary.landlordsRepresentativeLabel)}
    >
      {landlordRepresentatives?.map((landlordRep) => {
        return (
          <SummaryCardRow
            key={landlordRep.nationalIdWithName?.nationalId}
            editAction={goToScreen}
            route={partiesRoute}
            hasChangeButton={hasChangeButton}
          >
            <GridColumn span={['12/12']}>
              <KeyValue
                labelVariant="h5"
                labelAs="p"
                label={landlordRep.nationalIdWithName?.name ?? '-'}
                value={`${formatMessage(
                  summary.nationalIdLabel,
                )}${formatNationalId(
                  landlordRep.nationalIdWithName?.nationalId ?? '-',
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
    </SummaryCard>
  ) : null
}
