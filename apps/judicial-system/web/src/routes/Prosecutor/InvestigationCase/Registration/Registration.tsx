import { FC, FocusEvent, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Input, Select, toast } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  getStandardUserDashboardRoute,
  INVESTIGATION_CASE_DEFENDANT_ROUTE,
  InvestigationCaseTypes,
} from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatCaseType,
} from '@island.is/judicial-system/formatters'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isRegistrationStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { PoliceCaseNumbers, usePoliceCaseNumbers } from '../../components'

const Registration: FC = () => {
  // This state is needed because type is initially set to OTHER on the
  // workingCase and we need to validate that the user selects an option
  // from the case type list to allow the user to continue.
  const [caseType, setCaseType] = useState<CaseType | null>()

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { setAndSendCaseToServer, createCase, isCreatingCase } = useCase()

  const { clientPoliceNumbers, setClientPoliceNumbers } =
    usePoliceCaseNumbers(workingCase)

  const stepIsValid = isRegistrationStepValid(
    workingCase,
    caseType,
    clientPoliceNumbers,
  )

  useEffect(() => {
    if (workingCase.id) {
      setCaseType(workingCase.type)
    }
  }, [workingCase.id, workingCase.type])

  const handleDescriptionBlur = (
    evt: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setAndSendCaseToServer(
      [
        {
          description: evt.target.value.trim(),
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }

  const handleNavigationTo = async (destination: string) => {
    if (!workingCase.id) {
      const createdCase = await createCase(workingCase)

      if (createdCase) {
        router.push(`${destination}/${createdCase.id}`)
      } else {
        toast.error(formatMessage(errors.createCase))
      }
    } else {
      router.push(`${destination}/${workingCase.id}`)
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={!!workingCase.parentCase}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title="Efni kröfu - Réttarvörslugátt" />
      <FormContentContainer>
        <PageTitle>Rannsóknarheimild</PageTitle>
        <Box marginBottom={10}>
          <Box component="section" marginBottom={5}>
            <PoliceCaseNumbers
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              clientPoliceNumbers={clientPoliceNumbers}
              setClientPoliceNumbers={setClientPoliceNumbers}
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <SectionHeading title="Efni kröfu" />
            <BlueBox>
              <Box marginBottom={3}>
                <Select
                  name="type"
                  options={InvestigationCaseTypes}
                  label="Tegund kröfu"
                  placeholder="Veldu tegund kröfu"
                  onChange={(selectedOption) => {
                    const type = selectedOption?.value

                    setCaseType(type)
                    setAndSendCaseToServer(
                      [
                        {
                          type,
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  value={
                    workingCase.id
                      ? {
                          value: workingCase.type,
                          label: capitalize(formatCaseType(workingCase.type)),
                        }
                      : undefined
                  }
                  formatGroupLabel={() => (
                    <div
                      style={{
                        width: 'calc(100% + 24px)',
                        height: '3px',
                        marginLeft: '-12px',
                        backgroundColor: theme.color.dark300,
                      }}
                    />
                  )}
                  required
                />
              </Box>
              <Input
                data-testid="description"
                name="description"
                label="Efni kröfu"
                placeholder="Sláðu inn stutta lýsingu á efni kröfu ef við á"
                value={workingCase.description || ''}
                autoComplete="off"
                onChange={(evt) => {
                  setWorkingCase((prevWorkingCase) => ({
                    ...prevWorkingCase,
                    description: evt.target.value,
                  }))
                }}
                onBlur={handleDescriptionBlur}
                maxLength={255}
              />
            </BlueBox>
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={getStandardUserDashboardRoute(user)}
          onNextButtonClick={() =>
            handleNavigationTo(INVESTIGATION_CASE_DEFENDANT_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isCreatingCase}
          nextButtonText={workingCase.id === '' ? 'Stofna mál' : 'Halda áfram'}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Registration
