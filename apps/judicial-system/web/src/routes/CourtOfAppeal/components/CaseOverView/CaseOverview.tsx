import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  CaseDates,
  CaseFilesAccordionItem,
  FormContext,
  InfoCard,
  MarkdownWrapper,
  RestrictionTags,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import Conclusion from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion'
import {
  CaseDecision,
  CaseState,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'

import { courtOfAppealCaseOverview as strings } from './CaseOverView.strings'
import { titleForCase } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/SignedVerdictOverview'

const CourtOfAppealCaseOverview: React.FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const router = useRouter()

  return (
    <>
      <Box marginBottom={5}>
        <Box marginBottom={3}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() => router.push(constants.COURT_OF_APPEAL_CASES_ROUTE)}
          >
            {formatMessage(core.back)}
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
        <Box>
          <Box marginBottom={1}>
            <Text as="h1" variant="h1">
              {titleForCase(formatMessage, workingCase)}
            </Text>
          </Box>
          {workingCase.courtEndTime && (
            <Box>
              <RulingDateLabel courtEndTime={workingCase.courtEndTime} />
            </Box>
          )}
          {workingCase.appealedDate && (
            <Box marginTop={1}>
              <Text as="h5" variant="h5">
                {formatMessage(strings.appealedInfo, {
                  appealedByProsecutor:
                    workingCase.appealedByRole === UserRole.PROSECUTOR,
                  appealedDate: `${formatDate(
                    workingCase.appealedDate,
                    'PPP',
                  )} kl. ${formatDate(
                    workingCase.appealedDate,
                    constants.TIME_FORMAT,
                  )}`,
                })}
              </Text>
            </Box>
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <RestrictionTags workingCase={workingCase} />
        </Box>
      </Box>
      <Box marginBottom={5}>
        {isRestrictionCase(workingCase.type) &&
          workingCase.decision !==
            CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN &&
          workingCase.state === CaseState.ACCEPTED && (
            <CaseDates workingCase={workingCase} />
          )}
      </Box>
      {workingCase.caseModifiedExplanation && (
        <Box marginBottom={5}>
          <AlertMessage
            type="info"
            title={formatMessage(m.sections.modifyDatesInfo.titleV3, {
              caseType: workingCase.type,
            })}
            message={
              <MarkdownWrapper
                markdown={workingCase.caseModifiedExplanation}
                textProps={{ variant: 'small' }}
              />
            }
          />
        </Box>
      )}
      {workingCase.rulingModifiedHistory && (
        <Box marginBottom={5}>
          <AlertMessage
            type="info"
            title={formatMessage(m.sections.modifyRulingInfo.title)}
            message={
              <MarkdownWrapper
                markdown={workingCase.rulingModifiedHistory}
                textProps={{ variant: 'small' }}
              />
            }
          />
        </Box>
      )}
      <Box marginBottom={5}>
        <InfoCard
          defendants={
            workingCase.defendants
              ? {
                  title: capitalize(
                    formatMessage(core.defendant, {
                      suffix: workingCase.defendants.length > 1 ? 'ar' : 'i',
                    }),
                  ),
                  items: workingCase.defendants,
                }
              : undefined
          }
          defenders={[
            {
              name: workingCase.defenderName ?? '',
              defenderNationalId: workingCase.defenderNationalId,
              sessionArrangement: workingCase.sessionArrangements,
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
            },
          ]}
          data={[
            {
              title: formatMessage(core.policeCaseNumber),
              value: workingCase.policeCaseNumbers.map((n) => (
                <Text key={n}>{n}</Text>
              )),
            },
            {
              title: formatMessage(core.courtCaseNumber),
              value: workingCase.courtCaseNumber,
            },
            {
              title: formatMessage(core.prosecutor),
              value: `${workingCase.creatingProsecutor?.institution?.name}`,
            },
            {
              title: formatMessage(core.court),
              value: workingCase.court?.name,
            },
            {
              title: formatMessage(core.prosecutorPerson),
              value: workingCase.prosecutor?.name,
            },
            {
              title: formatMessage(core.judge),
              value: workingCase.judge?.name,
            },
            ...(workingCase.registrar
              ? [
                  {
                    title: formatMessage(core.registrar),
                    value: workingCase.registrar?.name,
                  },
                ]
              : []),
          ]}
        />
      </Box>
      {user ? (
        <Box marginBottom={3}>
          <CaseFilesAccordionItem
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            user={user}
          />
        </Box>
      ) : null}
      <Box marginBottom={6}>
        <Conclusion
          conclusionText={workingCase.conclusion}
          judgeName={workingCase.judge?.name}
          title="héraðsdóm"
        />
      </Box>
    </>
  )
}

export default CourtOfAppealCaseOverview
