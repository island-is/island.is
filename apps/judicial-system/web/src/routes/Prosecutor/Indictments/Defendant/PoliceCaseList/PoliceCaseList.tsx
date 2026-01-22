import { useContext, useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'
import equal from 'fast-deep-equal'
import { AnimatePresence, motion } from 'motion/react'
import { v4 as uuid } from 'uuid'

import { Box, Button } from '@island.is/island-ui/core'
import {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseOrigin,
  IndictmentSubtype,
  PoliceCaseInfo as TPoliceCaseInfo,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useIndictmentCounts,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { getDefaultDefendantGender } from '@island.is/judicial-system-web/src/utils/utils'

import { getIncidentDescription } from '../../Indictment/lib/getIncidentDescription'
import { PoliceCase, PoliceCaseUpdate } from './PoliceCase/PoliceCase'
import { PoliceCaseInfo } from './PoliceCaseInfo/PoliceCaseInfo'
import { strings } from './PoliceCaseList.strings'

interface TPoliceCase {
  number: string
  subtypes?: IndictmentSubtype[]
  place?: string
  date?: Date
}

interface IndexedPoliceCaseUpdate {
  index: number
  update: PoliceCaseUpdate
}

interface WorkingCaseUpdate {
  policeCaseNumbers: string[]
  indictmentSubtypes: IndictmentSubtypeMap
  crimeScenes: CrimeSceneMap
}

interface Checkpoint {
  old?: WorkingCaseUpdate
  update?: IndexedPoliceCaseUpdate
}

export const PoliceCaseList = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { setAndSendCaseToServer } = useCase()
  const { updateIndictmentCount } = useIndictmentCounts()

  const policeCaseIds = useRef<{ [key: string]: string }>({})
  const checkpoint = useRef<Checkpoint>({})

  const gender = useMemo(
    () => getDefaultDefendantGender(workingCase.defendants),
    [workingCase.defendants],
  )

  const policeCases: TPoliceCase[] = useMemo(() => {
    const policeCases =
      workingCase.policeCaseNumbers && workingCase.policeCaseNumbers.length > 0
        ? workingCase.policeCaseNumbers.map((policeCaseNumber) => ({
            number: policeCaseNumber,
            subtypes:
              workingCase.indictmentSubtypes &&
              workingCase.indictmentSubtypes[policeCaseNumber],
            place:
              workingCase.crimeScenes &&
              workingCase.crimeScenes[policeCaseNumber]?.place,
            date:
              workingCase.crimeScenes &&
              workingCase.crimeScenes[policeCaseNumber]?.date &&
              new Date(workingCase.crimeScenes[policeCaseNumber].date),
          }))
        : [{ number: '' }]

    const current = policeCaseIds.current
    policeCaseIds.current = policeCases.reduce((acc, c) => {
      acc[c.number] = current[c.number] ?? uuid()

      return acc
    }, {} as { [key: string]: string })

    return policeCases
  }, [workingCase])

  const getWorkingCaseUpdates = (
    policeCases: TPoliceCase[],
    updates: IndexedPoliceCaseUpdate[] = [],
  ): WorkingCaseUpdate => {
    const unsortedPoliceCaseNumbers: string[] = []
    const indictmentSubtypes: IndictmentSubtypeMap = {}
    const crimeScenes: CrimeSceneMap = {}

    const compare = (a: string, b: string): number => {
      const aDate = crimeScenes[a].date?.getTime()
      const bDate = crimeScenes[b].date?.getTime()

      // We want missing dates to be at the end of the list
      if (aDate === undefined || aDate === null) {
        return bDate === undefined || bDate === null ? 0 : 1
      }

      if (bDate === undefined || bDate === null) {
        return -1
      }

      return aDate !== bDate ? (aDate < bDate ? -1 : 1) : 0
    }

    policeCases.forEach((policeCase, idx) => {
      const update = updates.find((u) => u.index === idx)?.update
      const number =
        update && update.policeCaseNumber !== undefined
          ? update.policeCaseNumber
          : policeCase.number
      const subtypes =
        update && update.subtypes !== undefined
          ? update.subtypes
          : policeCase.subtypes ?? []
      const crimeScene =
        update && update.crimeScene !== undefined
          ? update.crimeScene
          : { place: policeCase.place, date: policeCase.date }

      if (number !== policeCase.number) {
        // If the police case number has changed, we need to update the policeCaseIds ref
        policeCaseIds.current[number] = policeCaseIds.current[policeCase.number]
      }

      unsortedPoliceCaseNumbers.push(number)
      indictmentSubtypes[number] = subtypes
      crimeScenes[number] = crimeScene
    })

    const [first, ...rest] = unsortedPoliceCaseNumbers

    const policeCaseNumbers =
      workingCase.origin === CaseOrigin.LOKE
        ? // If the case is a LÖKE case, we never change the first police case number
          [first, ...rest.sort(compare)]
        : unsortedPoliceCaseNumbers.sort(compare)

    return { policeCaseNumbers, indictmentSubtypes, crimeScenes }
  }

  const handleUpdateIndictmentCounts = (
    old: WorkingCaseUpdate,
    updated: WorkingCaseUpdate,
    updates: IndexedPoliceCaseUpdate[],
  ) => {
    if (!workingCase.indictmentCounts) {
      // No indictment counts to update
      return
    }

    const { policeCaseNumbers: oldPoliceCaseNumbers } = old
    const {
      indictmentSubtypes: updatedIndictmentSubtypes,
      crimeScenes: updatedCrimeScenes,
    } = updated

    let updatedIndictmentCounts = [...workingCase.indictmentCounts]

    for (const {
      index,
      update: {
        policeCaseNumber: policeCaseNumberUpdate,
        subtypes: subtypesUpdate,
        crimeScene: crimeSceneUpdate,
      },
    } of updates) {
      // Assumptions:
      // 1. At most one update per indictment count
      // 2. For each update, only one of the updates is set
      updatedIndictmentCounts = updatedIndictmentCounts.map(
        (indictmentCount) => {
          const policeCaseNumber = oldPoliceCaseNumbers[index]

          if (indictmentCount.policeCaseNumber !== policeCaseNumber) {
            return indictmentCount
          }

          if (policeCaseNumberUpdate) {
            // This case is handled by the server, but we need to update the local state
            return {
              ...indictmentCount,
              policeCaseNumber: policeCaseNumberUpdate,
            }
          }

          const policeCaseNumberSubtypes =
            subtypesUpdate ?? updatedIndictmentSubtypes[policeCaseNumber]

          if (policeCaseNumberSubtypes.length === 0) {
            // If there are no subtypes, we don't update the indictment count
            return indictmentCount
          }

          // handle changes based on police case subtype changes
          const indictmentCountSubtypes =
            indictmentCount.indictmentCountSubtypes || []
          const updatedIndictmentCountSubtypes = indictmentCountSubtypes.filter(
            (subtype) => policeCaseNumberSubtypes.includes(subtype),
          )
          const updatedIndictmentCount = {
            ...indictmentCount,
            indictmentCountSubtypes: updatedIndictmentCountSubtypes,
            policeCaseNumberSubtypes,
          }

          const incidentDescription = getIncidentDescription(
            updatedIndictmentCount,
            gender,
            crimeSceneUpdate ?? updatedCrimeScenes[policeCaseNumber],
            formatMessage,
            { [policeCaseNumber]: policeCaseNumberSubtypes },
          )

          // TODO: Handle all updates, except indictment desctiption server side
          updateIndictmentCount(workingCase.id, indictmentCount.id, {
            incidentDescription,
            indictmentCountSubtypes:
              updatedIndictmentCount.indictmentCountSubtypes,
            policeCaseNumberSubtypes:
              updatedIndictmentCount.policeCaseNumberSubtypes,
          })

          return { ...updatedIndictmentCount, incidentDescription }
        },
      )
    }

    // Update the indictment counts in the working case
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      indictmentCounts: updatedIndictmentCounts,
    }))
  }

  const handleCreatePoliceCases = (newPoliceCases: TPoliceCase[]) => {
    const { policeCaseNumbers, indictmentSubtypes, crimeScenes } =
      getWorkingCaseUpdates([...policeCases, ...newPoliceCases])

    setAndSendCaseToServer(
      [{ policeCaseNumbers, indictmentSubtypes, crimeScenes, force: true }],
      workingCase,
      setWorkingCase,
    )
  }

  const handleCreatePoliceCase = () => {
    handleCreatePoliceCases([{ number: '' }])
  }

  const handleAddPoliceCaseInfo = (policeCaseInfoList: TPoliceCaseInfo[]) => {
    const policeCases = policeCaseInfoList.map((policeCaseInfo) => ({
      number: policeCaseInfo.policeCaseNumber || '',
      place: policeCaseInfo.place || undefined,
      date: policeCaseInfo.date ? new Date(policeCaseInfo.date) : undefined,
      subtypes: policeCaseInfo.subtypes || undefined,
    }))

    handleCreatePoliceCases(policeCases)
  }

  const handleSetPoliceCase = (update: IndexedPoliceCaseUpdate) => {
    const { policeCaseNumbers, indictmentSubtypes, crimeScenes } =
      getWorkingCaseUpdates(policeCases, [update])

    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      policeCaseNumbers,
      indictmentSubtypes,
      crimeScenes,
    }))

    // This update has not been sent to the server yet.
    // Assumptions:
    // 1. A sequence of zero or more calls to handleSetPoliceCase
    //    will always be followed by an immediate call to handleUpdatePoliceCase.
    // 2. All the calls to handleSetPoliceCase are setting the same
    //    police case number index and the same update attribute,
    //    i.e. exatly one of policeCaseNumber, subtypes, or crimeScene.
    checkpoint.current.old = checkpoint.current.old ?? {
      policeCaseNumbers: workingCase.policeCaseNumbers ?? [],
      indictmentSubtypes: workingCase.indictmentSubtypes ?? {},
      crimeScenes: workingCase.crimeScenes ?? {},
    }
    checkpoint.current.update = update
  }

  const handleUpdatePoliceCase = (updates: IndexedPoliceCaseUpdate[] = []) => {
    const { policeCaseNumbers, indictmentSubtypes, crimeScenes } =
      getWorkingCaseUpdates(policeCases, updates)

    // Get the base case and unsaved updates
    const old: WorkingCaseUpdate =
      updates.length === 0 && checkpoint.current.old
        ? // Use the stored checkpoint case
          checkpoint.current.old
        : // Use the current case
          {
            policeCaseNumbers: workingCase.policeCaseNumbers ?? [],
            indictmentSubtypes: workingCase.indictmentSubtypes ?? {},
            crimeScenes: workingCase.crimeScenes ?? {},
          }
    const unsavedUpdates =
      updates.length === 0 && checkpoint.current.update
        ? // Use the stored checkpoint update
          [checkpoint.current.update]
        : // Use the current updates
          updates

    // Reset the checkpoint
    checkpoint.current = {}

    // Check if any changes need to be saved
    const policeCaseNumbersChanged =
      old.policeCaseNumbers.length !== policeCaseNumbers.length ||
      old.policeCaseNumbers.some(
        (number, index) => number !== policeCaseNumbers[index],
      )
    const indictmentSubtypesChanged = !equal(
      old.indictmentSubtypes,
      indictmentSubtypes,
    )
    const crimeScenesChanged = !equal(old.crimeScenes, crimeScenes)

    if (
      !policeCaseNumbersChanged &&
      !indictmentSubtypesChanged &&
      !crimeScenesChanged
    ) {
      // No changes, nothing to do
      return
    }

    setAndSendCaseToServer(
      [{ policeCaseNumbers, indictmentSubtypes, crimeScenes, force: true }],
      workingCase,
      setWorkingCase,
    )

    handleUpdateIndictmentCounts(
      old,
      { policeCaseNumbers, indictmentSubtypes, crimeScenes },
      unsavedUpdates,
    )
  }

  const handleDeletePoliceCase = async (index: number) => {
    const { policeCaseNumbers, indictmentSubtypes, crimeScenes } =
      getWorkingCaseUpdates(
        policeCases.slice(0, index).concat(policeCases.slice(index + 1)),
      )

    setAndSendCaseToServer(
      [{ policeCaseNumbers, indictmentSubtypes, crimeScenes, force: true }],
      workingCase,
      setWorkingCase,
    )

    // We need to remove all indictment counts which are associated
    // with the deleted police case from the working case.
    // These indictment counts where removed fro the server when
    // the police case was deleted.
    const indictmentCounts = workingCase.indictmentCounts?.filter(
      (count) => count.policeCaseNumber !== policeCases[index].number,
    )

    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      indictmentCounts,
    }))
  }

  const handlePoliceCaseInfoUpdate = (
    policeCaseInfoList: TPoliceCaseInfo[],
  ) => {
    // Update place and date if not previously set
    const updates: IndexedPoliceCaseUpdate[] = []

    for (const policeCaseInfo of policeCaseInfoList) {
      const idx = policeCases.findIndex(
        (pc) => pc.number === policeCaseInfo.policeCaseNumber,
      )

      if (idx < 0) {
        continue
      }

      const policeCase = policeCases[idx]

      let place: string | undefined = undefined
      let date: Date | undefined = undefined
      let subtypes: IndictmentSubtype[] | undefined = undefined

      if (!policeCase.place && policeCaseInfo.place) {
        place = policeCaseInfo.place
      }

      if (!policeCase.date && policeCaseInfo.date) {
        date = new Date(policeCaseInfo.date)
      }

      if (
        (!policeCase.subtypes || policeCase.subtypes?.length === 0) &&
        policeCaseInfo.subtypes
      ) {
        subtypes = policeCaseInfo.subtypes
      }

      if (place || date) {
        updates.push({
          index: idx,
          update: {
            crimeScene: {
              place: place ?? policeCase.place,
              date: date ?? policeCase.date,
            },
          },
        })
      }

      if (subtypes) {
        updates.push({
          index: idx,
          update: {
            subtypes,
          },
        })
      }
    }

    if (updates.length === 0) {
      return
    }

    handleUpdatePoliceCase(updates)
  }

  return (
    <Box component="section" marginBottom={5}>
      <SectionHeading
        title={formatMessage(strings.policeCaseNumbersHeading)}
        description={
          workingCase.origin === CaseOrigin.LOKE &&
          formatMessage(strings.policeCaseNumbersDescription)
        }
      />
      {workingCase.origin === CaseOrigin.LOKE && (
        <PoliceCaseInfo
          onPoliceCaseInfoLoaded={handlePoliceCaseInfoUpdate}
          onAddPoliceCaseInfo={handleAddPoliceCaseInfo}
        />
      )}
      <AnimatePresence>
        {policeCases.map((policeCase, index) => (
          <motion.div
            key={policeCaseIds.current[policeCase.number]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Box component="section" marginBottom={3}>
              {workingCase.policeCaseNumbers && (
                <PoliceCase
                  index={index}
                  setPoliceCase={(update: PoliceCaseUpdate) =>
                    handleSetPoliceCase({ index, update })
                  }
                  deletePoliceCase={
                    workingCase.policeCaseNumbers.length > 1 &&
                    !(workingCase.origin === CaseOrigin.LOKE && index === 0)
                      ? () => handleDeletePoliceCase(index)
                      : undefined
                  }
                  updatePoliceCase={(update?: PoliceCaseUpdate) =>
                    handleUpdatePoliceCase(update && [{ index, update }])
                  }
                />
              )}
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
      <Box display="flex" justifyContent="flexEnd" marginTop={3}>
        <Button
          data-testid="addPoliceCaseInfoButton"
          variant="ghost"
          icon="add"
          onClick={handleCreatePoliceCase}
          disabled={policeCases.some(
            (policeCase) =>
              !policeCase.number ||
              !policeCase.subtypes ||
              policeCase.subtypes.length === 0,
          )}
        >
          {formatMessage(strings.addPoliceCaseButtonText)}
        </Button>
      </Box>
    </Box>
  )
}
