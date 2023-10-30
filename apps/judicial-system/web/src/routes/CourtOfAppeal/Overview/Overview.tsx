import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  CaseFilesAccordionItem,
  Conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  PageHeader,
  PageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import CaseTitleInfoAndTags from '@island.is/judicial-system-web/src/components/CaseTitleInfoAndTags/CaseTitleInfoAndTags'
import { conclusion } from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion.strings'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'

import CaseFilesOverview from '../components/CaseFilesOverview/CaseFilesOverview'

const CourtOfAppealOverview: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { title, description, child } = useAppealAlertBanner(workingCase)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { user } = useContext(UserContext)

  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  console.log(child)
  return (
    <>
      <AlertBanner variant="warning" title={title} description={description}>
        {child}
      </AlertBanner>
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
        onNavigationTo={handleNavigationTo}
      >
        <PageHeader title={titleForCase(formatMessage, workingCase)} />
        <FormContentContainer>
          <CaseTitleInfoAndTags />
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
              title={formatMessage(conclusion.title)}
              conclusionText={workingCase.conclusion}
            />
          </Box>
          <CaseFilesOverview />
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={constants.COURT_OF_APPEAL_CASES_ROUTE}
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
