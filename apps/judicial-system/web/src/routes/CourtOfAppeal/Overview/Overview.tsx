import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  CaseDates,
  CaseFilesAccordionItem,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  MarkdownWrapper,
  PageHeader,
  PageLayout,
  PdfButton,
  RestrictionTags,
  SignedDocument,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import Conclusion from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion'
import {
  CaseDecision,
  CaseFileCategory,
  CaseState,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'
import { AlertBanner } from '@island.is/judicial-system-web/src/components/AlertBanner'
import useAppealAlertBanner from '@island.is/judicial-system-web/src/utils/hooks/useAppealAlertBanner'
import * as constants from '@island.is/judicial-system/consts'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'

import { courtOfAppealOverview as strings } from './Overview.strings'
import { titleForCase } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/SignedVerdictOverview'

const CourtOfAppealOverview: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const { title, description } = useAppealAlertBanner(workingCase)
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const router = useRouter()

  const appealCaseFiles = workingCase.caseFiles?.filter(
    (caseFile) =>
      caseFile.category &&
      /* 
      Please do not change the order of the following lines as they
      are rendered in the same order as they are listed here
      */
      [
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
      ].includes(caseFile.category),
  )

  const appealRulingFiles = workingCase.caseFiles?.filter(
    (caseFile) =>
      caseFile.category &&
      /* 
      Please do not change the order of the following lines as they
      are rendered in the same order as they are listed here
      */
      [CaseFileCategory.APPEAL_RULING].includes(caseFile.category),
  )

  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  return (
    <>
      <AlertBanner variant="warning" title={title} description={description} />
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader title={formatMessage(strings.title)} />
        <FormContentContainer>
          <Box marginBottom={5}>
            <Box marginBottom={3}>
              <Button
                variant="text"
                preTextIcon="arrowBack"
                onClick={() => router.push(constants.CASES_ROUTE)}
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
                          suffix:
                            workingCase.defendants.length > 1 ? 'ar' : 'i',
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
            />
          </Box>
          {appealCaseFiles && appealCaseFiles.length > 0 && (
            <Box marginBottom={5}>
              <Text as="h3" variant="h3">
                {formatMessage(strings.appealFilesTitle)}
              </Text>
              {appealCaseFiles
                .concat(appealRulingFiles ? appealRulingFiles : [])
                .map((file) => (
                  <PdfButton
                    key={file.id}
                    renderAs="row"
                    caseId={workingCase.id}
                    title={file.name}
                    handleClick={() => onOpen(file.id)}
                  >
                    {file.category &&
                      file.category !== CaseFileCategory.APPEAL_RULING && (
                        <Box
                          display="flex"
                          alignItems="flexEnd"
                          flexDirection="column"
                        >
                          <Text>
                            {`
                       ${formatDate(
                         file.created,
                         'dd.MM.y',
                       )}   kl. ${formatDate(
                              file.created,
                              constants.TIME_FORMAT,
                            )}
                    `}
                          </Text>

                          <Text variant="small">
                            {formatMessage(strings.appealFilesCategory, {
                              filesCategory: file.category?.includes(
                                'PROSECUTOR',
                              ),
                            })}
                          </Text>
                        </Box>
                      )}
                  </PdfButton>
                ))}
            </Box>
          )}
          <Box marginBottom={6}>
            <Text as="h3" variant="h3">
              {formatMessage(strings.courtCaseFilesTitle)}
            </Text>
            <PdfButton
              renderAs="row"
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRequest)}
              pdfType={'request'}
            />
            <PdfButton
              renderAs="row"
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRulingShortVersion)}
              pdfType={'courtRecord'}
            />
            <PdfButton
              renderAs="row"
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRuling)}
              pdfType={'ruling'}
            >
              {workingCase.rulingDate ? (
                <SignedDocument
                  signatory={workingCase.judge?.name}
                  signingDate={workingCase.rulingDate}
                />
              ) : (
                <Text>{formatMessage(strings.unsignedDocument)}</Text>
              )}
            </PdfButton>
          </Box>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={constants.CASES_ROUTE}
            onNextButtonClick={() =>
              handleNavigationTo(constants.COURT_OF_APPEAL_CASE_ROUTE)
            }
            nextButtonIcon="arrowForward"
          />
        </FormContentContainer>
      </PageLayout>
    </>
  )
}

export default CourtOfAppealOverview
