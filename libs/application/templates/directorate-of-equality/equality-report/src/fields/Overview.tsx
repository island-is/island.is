import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../lib/messages'
import { ApplicationAnswers } from '../lib/dataSchema'

const Row = ({ label, value }: { label: string; value?: string | null }) => (
  <GridRow marginBottom={2}>
    <GridColumn span="6/12">
      <Text variant="h5">{label}</Text>
    </GridColumn>
    <GridColumn span="6/12">
      <Text>{value || '—'}</Text>
    </GridColumn>
  </GridRow>
)

export const Overview = ({ application, goToScreen }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const answers = application.answers as ApplicationAnswers

  const subsidiaryList = answers.subsidiaries?.list ?? []
  const hasSubsidiaries = answers.subsidiaries?.includesSubsidiaries === 'yes'

  const equalityPlanFilename = getValueViaPath<string>(
    application.answers,
    'goalsAndActions.filename',
  )

  return (
    <Box>
      <ReviewGroup
        isEditable
        editAction={() => goToScreen?.('subsidiariesMultiField')}
      >
        <Text variant="h3" marginBottom={3}>
          {formatMessage(messages.overview.subsidiaries)}
        </Text>
        <Row
          label={formatMessage(messages.overview.hasSubsidiaries)}
          value={
            hasSubsidiaries
              ? formatMessage(messages.overview.yesSubsidiaries)
              : formatMessage(messages.overview.noSubsidiaries)
          }
        />
        {hasSubsidiaries &&
          subsidiaryList.map((s, i) => (
            <Row
              key={i}
              label={s.nationalIdWithName.name}
              value={s.nationalIdWithName.nationalId}
            />
          ))}
      </ReviewGroup>

      <ReviewGroup
        isEditable
        editAction={() => goToScreen?.('goalsAndActionsMultiField')}
        isLast
      >
        <Text variant="h3" marginBottom={3}>
          {formatMessage(messages.overview.equalityPlan)}
        </Text>
        <Row
          label={formatMessage(messages.overview.equalityPlanFile)}
          value={equalityPlanFilename}
        />
      </ReviewGroup>
    </Box>
  )
}

export default Overview
