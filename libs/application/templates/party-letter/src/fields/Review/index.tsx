import React, { FC } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { IDS } from '../../forms/LetterApplicationForm'

const Review: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const labelMapper: Record<IDS, string> = {
    ssd: formatMessage(m.overview.responsibleParty),
    'party.letter': formatMessage(m.overview.partyLetter),
    'party.name': formatMessage(m.overview.partyName),
    signatures: formatMessage(m.overview.signaturesCount),
    warnings: formatMessage(m.overview.warningCount),
  }

  const reviewItem = (label: string, answer: string) => {
    return label ? (
      <Box marginBottom={2} key={label}>
        <Text variant="h5">{label}</Text>
        <Text>{answer}</Text>
      </Box>
    ) : null
  }

  return (
    <Box>
      <Text variant="h3" marginBottom={3}>
        {formatMessage(m.overview.reviewTitle)}
      </Text>
      {Object.keys(application.answers).map((id) => {
        return reviewItem(
          labelMapper[id as IDS],
          getValueViaPath(application.answers, id) as string,
        )
      })}
      {reviewItem(labelMapper['signatures' as IDS], '305')}
      {reviewItem(labelMapper['warnings' as IDS], '18')}
      <Box marginTop={2}>
        <CheckboxController
          id={'includePapers'}
          defaultValue={[]}
          options={[
            {
              value: 'includePapers',
              label: formatMessage(m.overview.includePapers),
            },
          ]}
        />
      </Box>
    </Box>
  )
}

export default Review
