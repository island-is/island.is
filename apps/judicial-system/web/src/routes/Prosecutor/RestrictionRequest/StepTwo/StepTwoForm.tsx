import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'

import type { Case, Institution, User } from '@island.is/judicial-system/types'
import { Box, Input, Text, Checkbox } from '@island.is/island-ui/core'
import {
  removeTabsValidateAndSet,
  setAndSendDateToServer,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  DateTime,
  FormContentContainer,
  FormFooter,
  BlueBox,
  CaseInfo,
} from '@island.is/judicial-system-web/src/components'
import { rcRequestedHearingArrangements } from '@island.is/judicial-system-web/messages'
import { isHearingArrangementsStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import * as Constants from '@island.is/judicial-system/consts'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import RequestCourtDate from '../../SharedComponents/RequestCourtDate/RequestCourtDate'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  prosecutors: ReactSelectOption[]
  courts: Institution[]
  handleNextButtonClick: () => Promise<void>
  onProsecutorChange: (selectedOption: ValueType<ReactSelectOption>) => boolean
  onCourtChange: (courtId: string) => boolean
  transitionLoading: boolean
  user?: User
}

const StepTwoForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    prosecutors,
    courts,
    handleNextButtonClick,
    onProsecutorChange,
    onCourtChange,
    transitionLoading,
    user,
  } = props
  const { formatMessage } = useIntl()
  const { updateCase } = useCase()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(rcRequestedHearingArrangements.heading)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user?.role} />
        </Box>
        <Box component="section" marginBottom={5}>
          <BlueBox>
            <Box marginBottom={2}>
              <SelectProsecutor
                workingCase={workingCase}
                prosecutors={prosecutors}
                onChange={onProsecutorChange}
              />
            </Box>
            <Checkbox
              name="isHeightenedSecurityLevel"
              label={formatMessage(
                rcRequestedHearingArrangements.sections.prosecutor
                  .heightenSecurityLevelLabel,
              )}
              tooltip={formatMessage(
                rcRequestedHearingArrangements.sections.prosecutor
                  .heightenSecurityLevelInfo,
              )}
              disabled={
                user?.id !== workingCase.creatingProsecutor?.id &&
                user?.id !==
                  (((workingCase as unknown) as { prosecutorId: string })
                    .prosecutorId ?? workingCase.prosecutor?.id)
              }
              checked={workingCase.isHeightenedSecurityLevel}
              onChange={(event) =>
                setAndSendToServer(
                  'isHeightenedSecurityLevel',
                  event.target.checked,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }
              large
              filled
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={5}>
          <SelectCourt
            workingCase={workingCase}
            courts={courts}
            onChange={onCourtChange}
          />
        </Box>
        {!workingCase.parentCase && (
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(
                  rcRequestedHearingArrangements.sections.arrestDate.heading,
                )}
              </Text>
            </Box>
            <DateTime
              name="arrestDate"
              maxDate={new Date()}
              selectedDate={workingCase.arrestDate}
              onChange={(date: Date | undefined, valid: boolean) => {
                setAndSendDateToServer(
                  'arrestDate',
                  date,
                  valid,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }}
            />
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <RequestCourtDate
            workingCase={workingCase}
            onChange={(date: Date | undefined, valid: boolean) =>
              setAndSendDateToServer(
                'requestedCourtDate',
                date,
                valid,
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(
                rcRequestedHearingArrangements.sections.translator.heading,
              )}
            </Text>
          </Box>
          <Input
            data-testid="translator"
            name="translator"
            autoComplete="off"
            label={formatMessage(
              rcRequestedHearingArrangements.sections.translator.label,
            )}
            placeholder={formatMessage(
              rcRequestedHearingArrangements.sections.translator.placeholder,
            )}
            value={workingCase.translator || ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'translator',
                event.target.value,
                [],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'translator',
                event.target.value,
                [],
                workingCase,
                updateCase,
              )
            }
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_ONE_ROUTE}/${workingCase.id}`}
          onNextButtonClick={async () => await handleNextButtonClick()}
          nextIsDisabled={
            !isHearingArrangementsStepValidRC(workingCase) || transitionLoading
          }
          nextIsLoading={transitionLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default StepTwoForm
