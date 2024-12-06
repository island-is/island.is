import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  RenderFiles,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './IndictmentOverview.strings'
import { PunishmentType } from '@island.is/judicial-system/types'

const IndictmentOverview = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const [selectedPunishmentType, setPunishmentType] = useState<PunishmentType>()

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(strings.htmlTitle)} />
      <FormContentContainer>
        <PageTitle previousUrl={constants.PRISON_CASES_ROUTE}>
          {formatMessage(strings.title)}
        </PageTitle>
        <Box marginBottom={5}>
          {workingCase.courtCaseNumber && (
            <Box marginBottom={1}>
              <Text variant="h2" as="h2">
                {formatMessage(core.caseNumber, {
                  caseNumber: workingCase.courtCaseNumber,
                })}
              </Text>
            </Box>
          )}
          {workingCase.indictmentCompletedDate && (
            <Text variant="h4" as="h3">
              {formatMessage(strings.indictmentCompletedTitle, {
                date: formatDate(workingCase.indictmentCompletedDate, 'PPP'),
              })}
            </Text>
          )}
        </Box>
        <Box marginBottom={5}>
          <InfoCardClosedIndictment displayVerdictViewDate />
        </Box>
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(strings.verdictTitle)}
          </Text>
          <RenderFiles
            onOpenFile={onOpen}
            caseFiles={
              workingCase.caseFiles?.filter(
                (file) => file.category === CaseFileCategory.RULING,
              ) || []
            }
          />
        </Box>
        {/* TODO: Are we missing "Fullnusta" here? */}
        <Box marginBottom={10}>
          {/* Comment: Thought about using SectionHeading but its larger and thus not consistent with prev titles */}
          <Text variant="h4" as="h4" marginBottom={2}>
            {formatMessage(strings.punishmentTypeTitle)}
          </Text>
          <BlueBox>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-imprisonment"
                name="punishmentTypeImprisonment"
                checked={selectedPunishmentType === PunishmentType.IMPRISONMENT}
                onChange={() => {
                  setPunishmentType(PunishmentType.IMPRISONMENT)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.imprisonment)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-probation"
                name="punishmentTypeProbation"
                checked={selectedPunishmentType === PunishmentType.PROBATION}
                onChange={() => {
                  setPunishmentType(PunishmentType.PROBATION)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.probation)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-fine"
                name="punishmentTypeFine"
                checked={selectedPunishmentType === PunishmentType.FINE}
                onChange={() => {
                  setPunishmentType(PunishmentType.FINE)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.fine)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-indictment-ruling-decision-fine"
                name="punishmentTypeIndictmentRulingDecisionFine"
                checked={
                  selectedPunishmentType ===
                  PunishmentType.INDICTMENT_RULING_DECISION_FINE
                }
                onChange={() => {
                  setPunishmentType(
                    PunishmentType.INDICTMENT_RULING_DECISION_FINE,
                  )
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.indictmentRulingDecisionfine)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-indictment-signed-fine-invitation"
                name="punishmentTypeIndictmentSignedFineInvitation"
                checked={
                  selectedPunishmentType ===
                  PunishmentType.SIGNED_FINE_INVITATION
                }
                onChange={() => {
                  setPunishmentType(PunishmentType.SIGNED_FINE_INVITATION)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.signedFineInvitation)}
              />
            </Box>
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter previousUrl={constants.PRISON_CASES_ROUTE} hideNextButton />
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
