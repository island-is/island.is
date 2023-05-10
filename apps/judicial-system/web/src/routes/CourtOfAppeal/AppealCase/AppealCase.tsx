import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import { Box, Input, Option, Select } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  User,
  UserRole,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import * as constants from '@island.is/judicial-system/consts'
import {
  UserData,
  ReactSelectOption,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { isCourtOfAppealCaseStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { appealCase as strings } from './AppealCase.strings'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type AssistantSelectOption = ReactSelectOption & { assistant: User }

const AppealCase = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCase, setAndSendCaseToServer } = useCase()

  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query

  const [
    appealCaseNumberErrorMessage,
    setAppealCaseNumberErrorMessage,
  ] = useState<string>('')

  const { data: userData } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const assistants = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.REGISTRAR &&
        user.institution?.type === InstitutionType.HIGH_COURT,
    )
    .map((assistant: User) => {
      return { label: assistant.name, value: assistant.id, assistant }
    })

  const judges = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.JUDGE &&
        user.institution?.type === InstitutionType.HIGH_COURT,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id, judge }
    })

  const defaultJudges = [
    workingCase.appealJudge1,
    workingCase.appealJudge2,
    workingCase.appealJudge3,
  ]

  const defaultAssistant = assistants?.find(
    (assistant: Option) => assistant.value === workingCase.appealAssistant?.id,
  )

  const previousUrl = `${constants.COURT_OF_APPEAL_OVERVIEW_ROUTE}/${id}`
  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(strings.title)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>

        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(strings.caseNumberHeading)} />
          <Input
            name="appealCaseNumber"
            label={formatMessage(strings.caseNumberLabel)}
            value={workingCase.appealCaseNumber ?? ''}
            placeholder={formatMessage(strings.caseNumberPlaceholder)}
            errorMessage={appealCaseNumberErrorMessage}
            onChange={(event) => {
              removeTabsValidateAndSet(
                'appealCaseNumber',
                event.target.value,
                ['empty'],
                workingCase,
                setWorkingCase,
                appealCaseNumberErrorMessage,
                setAppealCaseNumberErrorMessage,
              )
            }}
            onBlur={(event) => {
              validateAndSendToServer(
                'appealCaseNumber',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setAppealCaseNumberErrorMessage,
              )
            }}
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(strings.assistantHeading)} />
          <Select
            name="assistant"
            label={formatMessage(strings.assistantLabel)}
            placeholder={formatMessage(strings.assistantPlaceholder)}
            value={defaultAssistant}
            options={assistants}
            onChange={(so: ValueType<ReactSelectOption>) => {
              const assistantUpdate = (so as AssistantSelectOption).assistant

              setAndSendCaseToServer(
                [
                  {
                    appealAssistantId: assistantUpdate.id ?? null,
                    force: true,
                  },
                ],
                workingCase,
                setWorkingCase,
              )
            }}
            required
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <SectionHeading title={formatMessage(strings.judgesHeading)} />
          <BlueBox>
            {defaultJudges.map((judge, index) => {
              return (
                <Box marginBottom={2} key={`judgeBox${index + 1}`}>
                  <Select
                    name="judge"
                    label={formatMessage(strings.judgeLabel)}
                    placeholder={formatMessage(strings.judgePlaceholder)}
                    value={
                      judge?.id
                        ? { label: judge.name, value: judge.id }
                        : undefined
                    }
                    options={judges}
                    onChange={(so: ValueType<ReactSelectOption>) => {
                      const judgeUpdate = (so as JudgeSelectOption).judge
                      const judgeProperty = `appealJudge${index + 1}Id`

                      setAndSendCaseToServer(
                        [
                          {
                            [judgeProperty]: judgeUpdate.id ?? null,
                            force: true,
                          },
                        ],
                        workingCase,
                        setWorkingCase,
                      )
                    }}
                    required
                  />
                </Box>
              )
            })}
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          nextButtonIcon="arrowForward"
          onNextButtonClick={() => {
            handleNavigationTo(constants.COURT_OF_APPEAL_RULING_ROUTE)
          }}
          nextButtonText={formatMessage(strings.nextButtonText)}
          nextIsDisabled={!isCourtOfAppealCaseStepValid(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default AppealCase
