import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import { uuid } from 'uuidv4'

import { Box, Button } from '@island.is/island-ui/core'
import {
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseOrigin,
  Defendant,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { DefendantInfo } from '../../../components'
import { getIndictmentIntroductionAutofill } from '../../Indictment/Indictment'
import { strings } from './DefendantList.strings'

export const DefendantList = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { setAndSendCaseToServer } = useCase()
  const {
    createDefendant,
    updateDefendant,
    deleteDefendant,
    updateDefendantState,
  } = useDefendants()

  const createEmptyDefendant = (defendantId?: string) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      defendants: prevWorkingCase.defendants && [
        ...prevWorkingCase.defendants,
        { id: defendantId || uuid() },
      ],
    }))
  }

  const handleCreateDefendantClick = async () => {
    if (workingCase.id) {
      const defendantId = await createDefendant({ caseId: workingCase.id })

      if (!defendantId) {
        return
      }

      createEmptyDefendant(defendantId)
    } else {
      createEmptyDefendant()
    }

    window.scrollTo(0, document.body.scrollHeight)
  }

  const handleUpdateDefendant = (updatedDefendant: UpdateDefendantInput) => {
    updateDefendantState(updatedDefendant, setWorkingCase)

    if (workingCase.id) {
      updateDefendant(updatedDefendant)

      if (workingCase.indictmentIntroduction) {
        setAndSendCaseToServer(
          [
            {
              indictmentIntroduction: getIndictmentIntroductionAutofill(
                formatMessage,
                workingCase.prosecutorsOffice,
                workingCase.court,
                workingCase.defendants,
              )?.join(''),
              force: true,
            },
          ],
          workingCase,
          setWorkingCase,
        )
      }
    }
  }

  const removeDefendantFromState = (defendant: Defendant) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      defendants:
        prevWorkingCase.defendants &&
        [...prevWorkingCase.defendants].filter((d) => d.id !== defendant.id),
    }))
  }

  const handleDeleteDefendant = async (defendant: Defendant) => {
    if (workingCase.defendants && workingCase.defendants.length > 1) {
      if (workingCase.id) {
        const deleted = await deleteDefendant(workingCase.id, defendant.id)

        if (!deleted) {
          return
        }

        removeDefendantFromState(defendant)
      } else {
        removeDefendantFromState(defendant)
      }
    }
  }

  return (
    <Box component="section" marginBottom={5}>
      <SectionHeading title={formatMessage(strings.defendantsHeading)} />
      <AnimatePresence>
        {workingCase.defendants?.map((defendant, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Box component="section" marginBottom={3}>
              <DefendantInfo
                defendant={defendant}
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                onDelete={
                  workingCase.defendants &&
                  workingCase.defendants.length > 1 &&
                  !(workingCase.origin === CaseOrigin.LOKE && index === 0)
                    ? handleDeleteDefendant
                    : undefined
                }
                onChange={handleUpdateDefendant}
                updateDefendantState={updateDefendantState}
                nationalIdImmutable={
                  workingCase.origin === CaseOrigin.LOKE && index === 0
                }
              />
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
      <Box display="flex" justifyContent="flexEnd" marginTop={3}>
        <Button
          data-testid="addDefendantButton"
          variant="ghost"
          icon="add"
          onClick={handleCreateDefendantClick}
          disabled={workingCase.defendants?.some(
            (defendant) =>
              !defendant.name ||
              !defendant.address ||
              (!defendant.noNationalId && !defendant.nationalId),
          )}
        >
          {formatMessage(strings.addDefendantButtonText)}
        </Button>
      </Box>
    </Box>
  )
}
