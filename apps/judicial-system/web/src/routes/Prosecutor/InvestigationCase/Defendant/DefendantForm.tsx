import React from 'react'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'
import { AnimatePresence, motion } from 'framer-motion'
import { uuid } from 'uuidv4'

import { Box, Button, Input, Select, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import { ICaseTypes } from '@island.is/judicial-system/consts'
import {
  CaseType,
  Defendant,
  isCaseTypeWithMultipleDefendantsSupport,
  UpdateDefendant,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { theme } from '@island.is/island-ui/theme'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import DefenderInfo from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo'
import { isDefendantStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { setAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'
import { isBusiness } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { defendant as m } from '@island.is/judicial-system-web/messages'
import * as constants from '@island.is/judicial-system/consts'
import LokeCaseNumber from '../../SharedComponents/LokeCaseNumber/LokeCaseNumber'
import DefendantInfo from '../../SharedComponents/DefendantInfo/DefendantInfo'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  handleNextButtonClick: (theCase: Case) => void
  isLoading: boolean
}

const DefendantForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    handleNextButtonClick,
    isLoading,
  } = props

  const { updateCase } = useCase()
  const { createDefendant, deleteDefendant, updateDefendant } = useDefendants()
  const { formatMessage } = useIntl()

  const updateDefendantState = (
    defendantId: string,
    update: UpdateDefendant,
  ) => {
    if (workingCase.defendants) {
      const indexOfDefendantToUpdate = workingCase.defendants.findIndex(
        (defendant) => defendant.id === defendantId,
      )

      const newDefendants = [...workingCase.defendants]

      newDefendants[indexOfDefendantToUpdate] = {
        ...newDefendants[indexOfDefendantToUpdate],
        ...update,
      }

      setWorkingCase({ ...workingCase, defendants: newDefendants })
    }
  }

  const handleUpdateDefendant = async (
    defendantId: string,
    updatedDefendant: UpdateDefendant,
  ) => {
    updateDefendantState(defendantId, updatedDefendant)

    if (workingCase.id) {
      updateDefendant(workingCase.id, defendantId, updatedDefendant)
    }
  }

  const handleDeleteDefendant = async (defendant: Defendant) => {
    if (workingCase.defendants && workingCase.defendants.length > 1) {
      if (workingCase.id) {
        const defendantDeleted = await deleteDefendant(
          workingCase.id,
          defendant.id,
        )

        if (defendantDeleted && workingCase.defendants) {
          removeDefendantFromState(defendant)
        } else {
          // TODO: handle error
        }
      } else {
        removeDefendantFromState(defendant)
      }
    }
  }

  const removeDefendantFromState = (defendant: Defendant) => {
    if (workingCase.defendants && workingCase.defendants?.length > 1) {
      setWorkingCase({
        ...workingCase,
        defendants: [...workingCase.defendants].filter(
          (d) => d.id !== defendant.id,
        ),
      })
    }
  }

  const handleCreateDefendantClick = async () => {
    if (workingCase.id) {
      const defendantId = await createDefendant(workingCase.id, {
        gender: undefined,
        name: '',
        address: '',
        nationalId: '',
        citizenship: '',
      })

      createEmptyDefendant(defendantId)
    } else {
      createEmptyDefendant()
    }

    window.scrollTo(0, document.body.scrollHeight)
  }

  const createEmptyDefendant = (defendantId?: string) => {
    if (workingCase.defendants) {
      setWorkingCase({
        ...workingCase,
        defendants: [
          ...workingCase.defendants,
          {
            id: defendantId || uuid(),
            gender: undefined,
            name: '',
            nationalId: '',
            address: '',
            citizenship: '',
          } as Defendant,
        ],
      })
    }
  }

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={10}>
          <Box marginBottom={7}>
            <Text as="h1" variant="h1">
              {formatMessage(m.heading)}
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <LokeCaseNumber
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.investigationType.heading)}
              </Text>
            </Box>
            <BlueBox>
              <Box marginBottom={3}>
                <Select
                  name="type"
                  options={ICaseTypes as ReactSelectOption[]}
                  label={formatMessage(m.sections.investigationType.type.label)}
                  placeholder={formatMessage(
                    m.sections.investigationType.type.placeholder,
                  )}
                  onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                    setAndSendToServer(
                      'type',
                      (selectedOption as ReactSelectOption).value as string,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }
                  value={
                    workingCase?.id
                      ? {
                          value: CaseType[workingCase.type],
                          label: capitalize(caseTypes[workingCase.type]),
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
                label={formatMessage(
                  m.sections.investigationType.description.label,
                )}
                placeholder={formatMessage(
                  m.sections.investigationType.description.placeholder,
                )}
                value={workingCase.description || ''}
                autoComplete="off"
                onChange={(evt) => {
                  setWorkingCase({
                    ...workingCase,
                    description: evt.target.value,
                  })
                }}
                onBlur={(evt) =>
                  setAndSendToServer(
                    'description',
                    evt.target.value,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.defendantInfo.heading)}
              </Text>
            </Box>
            <AnimatePresence>
              {workingCase.defendants &&
                workingCase.defendants.map((defendant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Box
                      marginBottom={
                        index - 1 === workingCase.defendants?.length ? 0 : 3
                      }
                    >
                      <DefendantInfo
                        defendant={defendant}
                        onDelete={index > 0 ? handleDeleteDefendant : undefined}
                        onChange={handleUpdateDefendant}
                        updateDefendantState={updateDefendantState}
                      />
                    </Box>
                  </motion.div>
                ))}
            </AnimatePresence>
            {isCaseTypeWithMultipleDefendantsSupport(workingCase.type) && (
              <Box display="flex" justifyContent="flexEnd" marginTop={3}>
                <Button
                  variant="ghost"
                  icon="add"
                  onClick={handleCreateDefendantClick}
                  disabled={workingCase.defendants?.some(
                    (defendant) =>
                      (!isBusiness(defendant.nationalId) &&
                        !defendant.gender) ||
                      !defendant.name ||
                      !defendant.address ||
                      (!defendant.noNationalId && !defendant.nationalId),
                  )}
                  data-testid="addDefendantButton"
                >
                  {formatMessage(
                    m.sections.defendantInfo.addDefendantButtonText,
                  )}
                </Button>
              </Box>
            )}
          </Box>
          <AnimatePresence>
            {[
              CaseType.RESTRAINING_ORDER,
              CaseType.EXPULSION_FROM_HOME,
              CaseType.PSYCHIATRIC_EXAMINATION,
              CaseType.OTHER,
            ].includes(workingCase.type) && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <DefenderInfo
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.CASE_LIST_ROUTE}`}
          onNextButtonClick={() => handleNextButtonClick(workingCase)}
          nextIsDisabled={!isDefendantStepValidIC(workingCase)}
          nextIsLoading={isLoading}
          nextButtonText={
            workingCase.id === '' ? 'Stofna kröfu' : 'Halda áfram'
          }
        />
      </FormContentContainer>
    </>
  )
}

export default DefendantForm
