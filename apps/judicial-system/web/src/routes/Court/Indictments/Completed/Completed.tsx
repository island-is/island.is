import React, { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  ServiceRequirement,
  CaseIndictmentRulingDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import strings from './Completed.strings'

const Completed: FC = () => {
  const { formatMessage } = useIntl()
  const { updateDefendantState } = useDefendants()

  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const stepIsValid = () =>
    workingCase.defendants?.every(
      (defendant) =>
        defendant.serviceRequirement !== undefined &&
        defendant.serviceRequirement !== null,
    )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      // onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.completed)} />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.heading)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <InfoCardClosedIndictment />
        </Box>
        <Box marginBottom={5}>
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        {workingCase.indictmentRulingDecision ===
          CaseIndictmentRulingDecision.RULING && (
          <Box marginBottom={10}>
            {workingCase.defendants?.map((defendant, index) => (
              <Box
                key={defendant.id}
                component="section"
                marginBottom={
                  workingCase.defendants &&
                  workingCase.defendants.length - 1 === index
                    ? 10
                    : 3
                }
              >
                <BlueBox>
                  <SectionHeading
                    title={defendant.name || ''}
                    marginBottom={2}
                    heading="h4"
                    required
                  />
                  <Box marginBottom={2}>
                    <RadioButton
                      id={`defendant-${defendant.id}-service-requirement-not-applicable`}
                      name={`defendant-${defendant.id}-service-requirement`}
                      checked={
                        defendant.serviceRequirement ===
                        ServiceRequirement.NOT_APPLICABLE
                      }
                      onChange={() => {
                        updateDefendantState(
                          {
                            defendantId: defendant.id,
                            caseId: workingCase.id,
                            serviceRequirement:
                              ServiceRequirement.NOT_APPLICABLE,
                          },
                          setWorkingCase,
                        )
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(
                        strings.serviceRequirementNotApplicable,
                      )}
                    />
                  </Box>
                  <Box marginBottom={2}>
                    <RadioButton
                      id={`defendant-${defendant.id}-service-requirement-required`}
                      name={`defendant-${defendant.id}-service-requirement`}
                      checked={
                        defendant.serviceRequirement ===
                        ServiceRequirement.REQUIRED
                      }
                      onChange={() => {
                        updateDefendantState(
                          {
                            defendantId: defendant.id,
                            caseId: workingCase.id,
                            serviceRequirement: ServiceRequirement.REQUIRED,
                          },
                          setWorkingCase,
                        )
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(strings.serviceRequirementRequired)}
                    />
                  </Box>
                  <RadioButton
                    id={`defendant-${defendant.id}-service-requirement-not-required`}
                    name={`defendant-${defendant.id}-service-requirement`}
                    checked={
                      defendant.serviceRequirement ===
                      ServiceRequirement.NOT_REQUIRED
                    }
                    onChange={() => {
                      updateDefendantState(
                        {
                          defendantId: defendant.id,
                          caseId: workingCase.id,
                          serviceRequirement: ServiceRequirement.NOT_REQUIRED,
                        },
                        setWorkingCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                    label={formatMessage(strings.serviceRequirementNotRequired)}
                  />
                </BlueBox>
              </Box>
            ))}
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.CASES_ROUTE}
          nextButtonText={formatMessage(strings.sendToPublicProsecutor)}
          nextIsDisabled={!stepIsValid()}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Completed
