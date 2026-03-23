import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import { v4 as uuid } from 'uuid'

import { Box, Button } from '@island.is/island-ui/core'
import { CaseOrigin } from '@island.is/judicial-system/types'
import {
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  Defendant,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDefendants,
  usePoliceCaseUnits,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { DefendantInfo } from '../../../components'
import { getIndictmentIntroductionAutofill } from '../../Indictment/Indictment'
import { strings } from './DefendantList.strings'

const isLokeCaseWithId = (
  origin: typeof CaseOrigin[keyof typeof CaseOrigin] | null | undefined,
  id: string,
) => origin === CaseOrigin.LOKE && Boolean(id)

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

  const showPoliceDefendantsUI = isLokeCaseWithId(
    workingCase.origin,
    workingCase.id,
  )

  // Fetch case units for all defendants after sync; response is only logged for now
  const defendantNationalIds =
    workingCase.defendants
      ?.map((d) => d.nationalId)
      .filter((id): id is string => Boolean(id)) ?? []
  usePoliceCaseUnits(
    showPoliceDefendantsUI ? workingCase.id : undefined,
    defendantNationalIds.length > 0 ? defendantNationalIds : undefined,
  )

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
                  workingCase.defendants && workingCase.defendants.length > 1
                    ? handleDeleteDefendant
                    : undefined
                }
                onChange={handleUpdateDefendant}
                updateDefendantState={updateDefendantState}
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
