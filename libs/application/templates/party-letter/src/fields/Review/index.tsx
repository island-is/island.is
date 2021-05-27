import React, { FC } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { IDS } from '../../forms/LetterApplicationForm'
import { PartyLetter, File } from '../../lib/dataSchema'

const Review: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const answers = application.answers as PartyLetter
  const endorsementsCount =
    answers.endorsements && answers.endorsements.length > 0
      ? answers.endorsements.length
      : 0
  const endorsementsWarningCount =
    answers.endorsements && answers.endorsements.length > 0
      ? answers.endorsements.filter(x => x.hasWarning === true).length
      : 0

  const labelMapper: Record<IDS, string> = {
    ssd: formatMessage(m.overview.responsibleParty),
    partyLetter: formatMessage(m.overview.partyLetter),
    partyName: formatMessage(m.overview.partyName),
    endorsements: formatMessage(m.overview.endorsementsCount),
    warnings: formatMessage(m.overview.warningCount),
    documents: formatMessage(m.overview.includedPapers),
  }

  const reviewItem = (label: string, answer: string) => {
    return label && answer ? (
      <Box marginBottom={2} key={label}>
        <Text variant="h5">{label}</Text>
        <Text>{answer}</Text>
      </Box>
    ) : null
  }

  const documentNames = (documents: File[]) => {
    return documents.map((x) => x.name).join(', ')
  }

  return (
    <Box>
      <Text variant="h3" marginBottom={3}>
        {formatMessage(m.overview.reviewTitle)}
      </Text>
      {reviewItem(
        labelMapper[IDS.PartyName],
        getValueViaPath(answers, IDS.PartyName) as string,
      )}
      {reviewItem(
        labelMapper[IDS.PartyLetter],
        getValueViaPath(answers, IDS.PartyLetter) as string,
      )}
      {reviewItem(labelMapper[IDS.Endorsements], endorsementsCount.toString())}
      {reviewItem(labelMapper[IDS.Warnings], endorsementsWarningCount.toString())}
      {answers.documents
        ? reviewItem(
            labelMapper[IDS.Documents],
            documentNames(getValueViaPath(answers, IDS.Documents) as File[]),
          )
        : null}
    </Box>
  )
}

export default Review
