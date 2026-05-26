import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import { Reorder } from 'motion/react'

import { Accordion, Box, Button } from '@island.is/island-ui/core'
import {
  getIndictmentCountCompare,
  sortIndictmentCounts,
} from '@island.is/judicial-system/types'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  IndictmentCount as TIndictmentCount,
  Offense,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  UpdateIndictmentCount,
  UpdateIndictmentCountState,
  useIndictmentCounts,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { IndictmentCount } from './IndictmentCount'
import { IndictmentCountAccordionItem } from './IndictmentCountAccordionItem'
import { strings } from './Indictment.strings'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  handleUpdateIndictmentCount: (
    indictmentCountId: string,
    indictmentCountUpdate: UpdateIndictmentCount,
    updatedOffenses?: Offense[],
  ) => Promise<void>
  handleDeleteIndictmentCount: (indictmentCountId: string) => Promise<void>
  updateIndictmentCountState: (
    indictmentCountId: string,
    indictmentCountUpdate: UpdateIndictmentCountState,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => void
}

const hasOrderChanged = (
  current: TIndictmentCount[],
  previous: TIndictmentCount[],
) => {
  if (current.length !== previous.length) {
    return true
  }

  return current.some((count, index) => count.id !== previous[index]?.id)
}

export const IndictmentCountsList: FC<Props> = ({
  workingCase,
  setWorkingCase,
  handleUpdateIndictmentCount,
  handleDeleteIndictmentCount,
  updateIndictmentCountState,
}) => {
  const { formatMessage } = useIntl()
  const { reorderIndictmentCounts } = useIndictmentCounts()

  const sorted = useMemo(
    () => sortIndictmentCounts(workingCase.indictmentCounts ?? []),
    [workingCase.indictmentCounts],
  )

  const [reorderableCounts, setReorderableCounts] =
    useState<TIndictmentCount[]>(sorted)

  const reorderableCountsRef = useRef(reorderableCounts)
  const lastPersistedOrderRef = useRef(sorted)

  useEffect(() => {
    setReorderableCounts(sorted)
    lastPersistedOrderRef.current = sorted
    reorderableCountsRef.current = sorted
  }, [sorted])

  useEffect(() => {
    reorderableCountsRef.current = reorderableCounts
  }, [reorderableCounts])

  const persistOrder = useCallback(
    async (counts: TIndictmentCount[]) => {
      const updates = counts.map((c, i) => ({ id: c.id, displayOrder: i }))
      const result = await reorderIndictmentCounts(workingCase.id, updates)

      if (!result) {
        setReorderableCounts(sorted)
        lastPersistedOrderRef.current = sorted
        reorderableCountsRef.current = sorted
        return
      }

      setWorkingCase((prev) => ({
        ...prev,
        indictmentCounts: sortIndictmentCounts(
          prev.indictmentCounts?.map((c) => {
            const update = updates.find((u) => u.id === c.id)
            return update ? { ...c, displayOrder: update.displayOrder } : c
          }) ?? [],
        ),
      }))

      lastPersistedOrderRef.current = counts
    },
    [reorderIndictmentCounts, setWorkingCase, sorted, workingCase.id],
  )

  const handleDragEnd = useCallback(() => {
    const current = reorderableCountsRef.current

    if (!hasOrderChanged(current, lastPersistedOrderRef.current)) {
      return
    }

    persistOrder(current)
  }, [persistOrder])

  const handleChronologicalSort = useCallback(() => {
    const chron = [...reorderableCountsRef.current].sort(
      getIndictmentCountCompare(workingCase.crimeScenes),
    )

    setReorderableCounts(chron)
    reorderableCountsRef.current = chron
    persistOrder(chron)
  }, [persistOrder, workingCase.crimeScenes])

  const canDelete = reorderableCounts.length > 1

  return (
    <Box component="section">
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={3}
      >
        <SectionHeading
          title={formatMessage(strings.indictmentCountsTitle)}
          marginBottom={0}
        />
        <Button variant="text" onClick={handleChronologicalSort}>
          {formatMessage(strings.sortIndictmentCountsChronologically)}
        </Button>
      </Box>
      <Reorder.Group
        axis="y"
        values={reorderableCounts}
        onReorder={setReorderableCounts}
      >
        <Accordion singleExpand={false} dividerOnTop={false}>
          {reorderableCounts.map((indictmentCount, index) => (
            <IndictmentCountAccordionItem
              key={indictmentCount.id}
              index={index}
              indictmentCount={indictmentCount}
              workingCase={workingCase}
              onReorder={handleDragEnd}
              onDelete={canDelete ? handleDeleteIndictmentCount : undefined}
            >
              <IndictmentCount
                indictmentCount={indictmentCount}
                workingCase={workingCase}
                onDelete={
                  canDelete ? handleDeleteIndictmentCount : undefined
                }
                onChange={handleUpdateIndictmentCount}
                setWorkingCase={setWorkingCase}
                updateIndictmentCountState={updateIndictmentCountState}
              />
            </IndictmentCountAccordionItem>
          ))}
        </Accordion>
      </Reorder.Group>
    </Box>
  )
}
