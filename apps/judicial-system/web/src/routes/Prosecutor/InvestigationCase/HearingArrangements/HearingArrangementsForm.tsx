import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select'

import {
  BlueBox,
  CaseInfo,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import { Box, Checkbox, Input, Text } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  removeTabsValidateAndSet,
  setAndSendDateToServer,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { icRequestedHearingArrangements as m } from '@island.is/judicial-system-web/messages'
import { isHearingArrangementsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import type {
  Case,
  Institution,
  UpdateCase,
  User,
} from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import RequestCourtDate from '../../SharedComponents/RequestCourtDate/RequestCourtDate'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  user: User
  prosecutors: ReactSelectOption[]
  courts: Institution[]
  isLoading: boolean
  onNextButtonClick: () => Promise<void>
  onProsecutorChange: (selectedOption: ValueType<ReactSelectOption>) => boolean
  onCourtChange: (courtId: string) => boolean
  updateCase: (id: string, updateCase: UpdateCase) => Promise<Case | undefined>
}

const HearingArrangementsForms: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    user,
    prosecutors,
    courts,
    isLoading,
    onNextButtonClick,
    onProsecutorChange,
    onCourtChange,
    updateCase,
  } = props

  const { formatMessage } = useIntl()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user.role} />
        </Box>
        {prosecutors && (
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
                  m.sections.prosecutor.heightenSecurityLevelLabel,
                )}
                tooltip={formatMessage(
                  m.sections.prosecutor.heightenSecurityLevelInfo,
                )}
                disabled={
                  user.id !== workingCase.creatingProsecutor?.id &&
                  user.id !==
                    (((workingCase as unknown) as { prosecutorId: string })
                      .prosecutorId === undefined
                      ? workingCase.prosecutor?.id
                      : ((workingCase as unknown) as { prosecutorId: string })
                          .prosecutorId)
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
        )}
        {courts && (
          <Box component="section" marginBottom={5}>
            <SelectCourt
              workingCase={workingCase}
              courts={courts}
              onChange={onCourtChange}
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
              {formatMessage(m.sections.translator.heading)}
            </Text>
          </Box>
          <Input
            data-testid="translator"
            name="translator"
            autoComplete="off"
            label={formatMessage(m.sections.translator.label)}
            placeholder={formatMessage(m.sections.translator.placeholder)}
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
          previousUrl={`${constants.IC_DEFENDANT_ROUTE}/${workingCase.id}`}
          onNextButtonClick={async () => await onNextButtonClick()}
          nextIsDisabled={!isHearingArrangementsStepValidIC(workingCase)}
          nextIsLoading={isLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default HearingArrangementsForms
