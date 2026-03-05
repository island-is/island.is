import { useContext, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import { v4 as uuid } from 'uuid'

import { Box, Button } from '@island.is/island-ui/core'
import {
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseOrigin,
  Defendant,
  Gender,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { usePoliceDefendantsQuery } from '@island.is/judicial-system-web/src/utils/hooks/usePoliceDefendants/policeDefendants.generated'

import { DefendantInfo } from '../../../components'
import { getIndictmentIntroductionAutofill } from '../../Indictment/Indictment'
import { strings } from './DefendantList.strings'

const mapPoliceGenderToGender = (gender?: string | null): Gender | undefined =>
  gender === 'MALE' || gender === 'male'
    ? Gender.MALE
    : gender === 'FEMALE' || gender === 'female'
      ? Gender.FEMALE
      : gender === 'OTHER' || gender === 'other'
        ? Gender.OTHER
        : undefined

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
  const hasCreatedFromPoliceRef = useRef(false)

  const { data: policeDefendantsData } = usePoliceDefendantsQuery({
    variables: { input: { caseId: workingCase.id } },
    skip:
      workingCase.origin !== CaseOrigin.LOKE ||
      (workingCase.defendants?.length ?? 0) > 0 ||
      !workingCase.id,
    fetchPolicy: 'cache-first',
  })

  useEffect(() => {
    if (
      !workingCase.id ||
      hasCreatedFromPoliceRef.current ||
      (workingCase.defendants?.length ?? 0) > 0
    ) {
      return
    }
    const defendantsFromPolice = policeDefendantsData?.policeDefendants
    if (!defendantsFromPolice?.length) {
      return
    }
    const createFromPolice = async () => {
      hasCreatedFromPoliceRef.current = true
      const newDefendants: { id: string; nationalId?: string | null; name?: string | null; gender?: Gender; address?: string | null; citizenship?: string | null }[] = []
      for (const p of defendantsFromPolice) {
        const defendantId = await createDefendant({
          caseId: workingCase.id,
          nationalId: p.nationalId ?? undefined,
          name: p.name ?? undefined,
          gender: mapPoliceGenderToGender(p.gender),
          address: p.address ?? undefined,
          citizenship: p.citizenship ?? undefined,
        })
        if (defendantId) {
          newDefendants.push({
            id: defendantId,
            nationalId: p.nationalId,
            name: p.name,
            gender: mapPoliceGenderToGender(p.gender),
            address: p.address,
            citizenship: p.citizenship,
          })
        }
      }
      if (newDefendants.length > 0) {
        setWorkingCase((prev) => ({
          ...prev,
          defendants: [...(prev.defendants ?? []), ...newDefendants],
        }))
      } else {
        hasCreatedFromPoliceRef.current = false
      }
    }
    createFromPolice()
  }, [
    workingCase.id,
    workingCase.defendants?.length,
    policeDefendantsData?.policeDefendants,
    createDefendant,
    setWorkingCase,
  ])

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
