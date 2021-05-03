import React, { useEffect, useState } from 'react'
import { Text, Box, Input } from '@island.is/island-ui/core'
import { Case, CaseType } from '@island.is/judicial-system/types'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import {
  FormFooter,
  PageLayout,
  BlueBox,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setCheckboxAndSendToServer,
  newSetAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { formatDate } from '@island.is/judicial-system/formatters'
import CheckboxList from '@island.is/judicial-system-web/src/shared-components/CheckboxList/CheckboxList'
import {
  custodyProvisions,
  travelBanProvisions,
} from '@island.is/judicial-system-web/src/utils/laws'
import {
  alternativeTravelBanRestrictions,
  restrictions,
} from '@island.is/judicial-system-web/src/utils/Restrictions'
import { useRouter } from 'next/router'
import DateTime from '@island.is/judicial-system-web/src/shared-components/DateTime/DateTime'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'

export const StepThree: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const router = useRouter()
  const id = router.query.id

  const [lawsBrokenErrorMessage, setLawsBrokenErrorMessage] = useState<string>(
    '',
  )

  const [
    requestedCustodyEndDateIsValid,
    setRequestedCustodyEndDateIsValid,
  ] = useState(false)

  const { updateCase } = useCase()
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && resCase) {
      setRequestedCustodyEndDateIsValid(resCase.requestedCustodyEndDate != null)

      setWorkingCase(resCase)
    }
  }, [workingCase, setWorkingCase, resCase])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={
        ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_THREE
      }
      isLoading={loading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                Dómkröfur og lagagrundvöllur
              </Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Dómkröfur
                </Text>
                {workingCase.parentCase && (
                  <Box marginTop={1}>
                    <Text>
                      Fyrri gæsla var/er til{' '}
                      <Text as="span" fontWeight="semiBold">
                        {formatDate(
                          workingCase.parentCase.custodyEndDate,
                          'PPPPp',
                        )?.replace('dagur,', 'dagsins')}
                      </Text>
                    </Text>
                  </Box>
                )}
              </Box>
              <DateTime
                name="reqCustodyEndDate"
                datepickerLabel={`${
                  workingCase.type === CaseType.CUSTODY
                    ? 'Gæsluvarðhald'
                    : 'Farbann'
                } til`}
                minDate={new Date()}
                selectedDate={
                  workingCase.requestedCustodyEndDate
                    ? new Date(workingCase.requestedCustodyEndDate)
                    : undefined
                }
                onChange={(date: Date | undefined, valid: boolean) => {
                  newSetAndSendDateToServer(
                    'requestedCustodyEndDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    setRequestedCustodyEndDateIsValid,
                    updateCase,
                  )
                }}
                required
              />
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Lagaákvæði sem brot varða við
                </Text>
              </Box>
              <Input
                data-testid="lawsBroken"
                name="lawsBroken"
                label="Lagaákvæði sem ætluð brot kærða þykja varða við"
                placeholder="Skrá inn þau lagaákvæði sem brotið varðar við, til dæmis 1. mgr. 244 gr. almennra hegningarlaga nr. 19/1940..."
                defaultValue={workingCase?.lawsBroken}
                errorMessage={lawsBrokenErrorMessage}
                hasError={lawsBrokenErrorMessage !== ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'lawsBroken',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    lawsBrokenErrorMessage,
                    setLawsBrokenErrorMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'lawsBroken',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setLawsBrokenErrorMessage,
                  )
                }
                required
                textarea
                rows={7}
              />
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Lagaákvæði sem krafan er byggð á{' '}
                  <Text as="span" color={'red600'} fontWeight="semiBold">
                    *
                  </Text>
                </Text>
              </Box>
              <BlueBox>
                <CheckboxList
                  checkboxes={
                    workingCase.type === CaseType.CUSTODY
                      ? custodyProvisions
                      : travelBanProvisions
                  }
                  selected={workingCase.custodyProvisions}
                  onChange={(id) =>
                    setCheckboxAndSendToServer(
                      'custodyProvisions',
                      id,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }
                />
              </BlueBox>
            </Box>
            {workingCase.type === CaseType.CUSTODY && (
              <Box component="section" marginBottom={10}>
                <Box marginBottom={3}>
                  <Box marginBottom={1}>
                    <Text as="h3" variant="h3">
                      Takmarkanir og tilhögun gæslu
                    </Text>
                  </Box>
                  <Text>Ef ekkert er valið er gæsla án takmarkana</Text>
                </Box>
                <BlueBox>
                  <CheckboxList
                    checkboxes={restrictions}
                    selected={workingCase.requestedCustodyRestrictions}
                    onChange={(id) =>
                      setCheckboxAndSendToServer(
                        'requestedCustodyRestrictions',
                        id,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                  />
                </BlueBox>
              </Box>
            )}
            {workingCase.type === CaseType.TRAVEL_BAN && (
              <Box component="section" marginBottom={4}>
                <Box marginBottom={3}>
                  <Text as="h3" variant="h3">
                    Takmarkanir og tilhögun farbanns
                  </Text>
                  <Text>Ef ekkert er valið er farbann án takmarkana.</Text>
                </Box>
                <BlueBox>
                  <Box marginBottom={3}>
                    <CheckboxList
                      checkboxes={alternativeTravelBanRestrictions}
                      selected={workingCase.requestedCustodyRestrictions}
                      onChange={(id) =>
                        setCheckboxAndSendToServer(
                          'requestedCustodyRestrictions',
                          id,
                          workingCase,
                          setWorkingCase,
                          updateCase,
                        )
                      }
                    />
                  </Box>
                  <Input
                    name="requestedOtherRestrictions"
                    data-testid="requestedOtherRestrictions"
                    label="Nánari útlistun eða aðrar takmarkanir"
                    defaultValue={workingCase.requestedOtherRestrictions}
                    placeholder="Til dæmis hvernig tilkynningarskyldu sé háttað..."
                    onChange={(event) =>
                      removeTabsValidateAndSet(
                        'requestedOtherRestrictions',
                        event,
                        [],
                        workingCase,
                        setWorkingCase,
                      )
                    }
                    onBlur={(event) =>
                      validateAndSendToServer(
                        'requestedOtherRestrictions',
                        event.target.value,
                        [],
                        workingCase,
                        updateCase,
                      )
                    }
                    rows={10}
                    textarea
                  />
                </BlueBox>
              </Box>
            )}
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.STEP_TWO_ROUTE}/${workingCase.id}`}
              nextUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
              nextIsDisabled={
                !validate(workingCase.lawsBroken || '', 'empty').isValid ||
                !requestedCustodyEndDateIsValid ||
                !workingCase.custodyProvisions ||
                workingCase.custodyProvisions?.length === 0
              }
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepThree
