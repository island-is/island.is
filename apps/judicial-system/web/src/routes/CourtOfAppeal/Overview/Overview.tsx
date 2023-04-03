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
  PageHeader,
  PageLayout,
  PdfButton,
  RestrictionTags,
  SignedDocument,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { Sections } from '@island.is/judicial-system-web/src/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import { capitalize } from '@island.is/judicial-system/formatters'
import * as constants from '@island.is/judicial-system/consts'

import { courtOfAppealOverview as strings } from './Overview.strings'
import Conclusion from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion'

const CourtOfAppealOverview: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const router = useRouter()

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.CASE_CLOSED}
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
                {formatMessage(strings.title)}
              </Text>
            </Box>
            {workingCase.courtEndTime && (
              <Box>
                <RulingDateLabel courtEndTime={workingCase.courtEndTime} />
              </Box>
            )}
          </Box>
          <Box display="flex" flexDirection="column">
            <RestrictionTags workingCase={workingCase} />
          </Box>
        </Box>
        <Box marginBottom={5}>
          <CaseDates workingCase={workingCase} />
        </Box>
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
          />
        </Box>
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
            ) : null}
            {/* TODO: CAN THERE BE A UNSIGNED DOCUMENT HERE? */}
          </PdfButton>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.CASES_ROUTE}
          onNextButtonClick={() => console.log('23')}
          nextButtonIcon="arrowForward"
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtOfAppealOverview
