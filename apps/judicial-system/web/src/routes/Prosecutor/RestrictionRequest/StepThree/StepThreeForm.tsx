import React, { useState } from 'react'
import { Box, Text, Input } from '@island.is/island-ui/core'
import {
  formatAccusedByGender,
  formatDate,
  NounCases,
} from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  BlueBox,
  DateTime,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  setCheckboxAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import CheckboxList from '@island.is/judicial-system-web/src/shared-components/CheckboxList/CheckboxList'
import {
  custodyProvisions,
  travelBanProvisions,
} from '@island.is/judicial-system-web/src/utils/laws'
import {
  alternativeTravelBanRestrictions,
  restrictions,
} from '@island.is/judicial-system-web/src/utils/Restrictions'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  requestedValidToDateIsValid: boolean
  setRequestedValidToDateIsValid: React.Dispatch<React.SetStateAction<boolean>>
}

const StepThreeForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    requestedValidToDateIsValid,
    setRequestedValidToDateIsValid,
  } = props
  const [lawsBrokenErrorMessage, setLawsBrokenErrorMessage] = useState<string>(
    '',
  )

  const { updateCase } = useCase()

  return (
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
                  {`${
                    workingCase.type === CaseType.CUSTODY
                      ? 'Fyrri gæsla'
                      : 'Fyrra farbann'
                  } var/er til `}
                  <Text as="span" fontWeight="semiBold">
                    {formatDate(
                      workingCase.parentCase.validToDate,
                      'PPPPp',
                    )?.replace('dagur,', 'dagsins')}
                  </Text>
                </Text>
              </Box>
            )}
          </Box>
          <DateTime
            name="reqValidToDate"
            datepickerLabel={`${
              workingCase.type === CaseType.CUSTODY
                ? 'Gæsluvarðhald'
                : 'Farbann'
            } til`}
            minDate={new Date()}
            selectedDate={
              workingCase.requestedValidToDate
                ? new Date(workingCase.requestedValidToDate)
                : undefined
            }
            onChange={(date: Date | undefined, valid: boolean) => {
              newSetAndSendDateToServer(
                'requestedValidToDate',
                date,
                valid,
                workingCase,
                setWorkingCase,
                setRequestedValidToDateIsValid,
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
            label={`Lagaákvæði sem ætluð brot ${formatAccusedByGender(
              workingCase?.accusedGender,
              NounCases.GENITIVE,
            )} þykja varða við`}
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
            !validate(workingCase.lawsBroken ?? '', 'empty').isValid ||
            !requestedValidToDateIsValid ||
            !workingCase.custodyProvisions ||
            workingCase.custodyProvisions?.length === 0
          }
        />
      </FormContentContainer>
    </>
  )
}

export default StepThreeForm
