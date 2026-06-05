import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
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

const applyDisplayOrder = (
  counts: TIndictmentCount[],
  order: TIndictmentCount[],
): TIndictmentCount[] => {
  const countsById = new Map(counts.map((count) => [count.id, count]))

  return order.map((item, index) => ({
    ...(countsById.get(item.id) ?? item),
    displayOrder: index,
  }))
}

const revertToSavedOrder = (
  counts: TIndictmentCount[],
  saved: TIndictmentCount[],
): TIndictmentCount[] => {
  const countsById = new Map(counts.map((count) => [count.id, count]))
  const restored = saved.reduce<TIndictmentCount[]>((acc, item) => {
    const count = countsById.get(item.id)

    if (!count) {
      return acc
    }

    return [...acc, { ...count, displayOrder: acc.length }]
  }, [])

  const restoredIds = new Set(restored.map((count) => count.id))
  const added = counts
    .filter((count) => !restoredIds.has(count.id))
    .map((count, index) => ({
      ...count,
      displayOrder: restored.length + index,
    }))

  return [...restored, ...added]
}

export const IndictmentCountsList: FC<Props> = ({
  workingCase,
  setWorkingCase,
  handleUpdateIndictmentCount,
  handleDeleteIndictmentCount,
  updateIndictmentCountState,
}) => {
  const { reorderIndictmentCounts } = useIndictmentCounts()

  const orderedCounts = sortIndictmentCounts(workingCase.indictmentCounts ?? [])
  const savedOrderRef = useRef(orderedCounts)

  const handleReorder = useCallback(
    (newOrder: TIndictmentCount[]) => {
      setWorkingCase((prev) => ({
        ...prev,
        indictmentCounts: applyDisplayOrder(
          prev.indictmentCounts ?? [],
          newOrder,
        ),
      }))
    },
    [setWorkingCase],
  )

  const persistOrder = useCallback(
    async (counts: TIndictmentCount[]) => {
      const updates = counts.map((c, i) => ({ id: c.id, displayOrder: i }))
      const result = await reorderIndictmentCounts(workingCase.id, updates)

      if (!result) {
        setWorkingCase((prev) => ({
          ...prev,
          indictmentCounts: revertToSavedOrder(
            prev.indictmentCounts ?? [],
            savedOrderRef.current,
          ),
        }))
        return
      }

      savedOrderRef.current = counts
    },
    [reorderIndictmentCounts, setWorkingCase, workingCase.id],
  )

  const handleDragEnd = useCallback(() => {
    persistOrder(orderedCounts)
  }, [orderedCounts, persistOrder])

  const handleChronologicalSort = useCallback(() => {
    const chron = [...orderedCounts].sort(
      getIndictmentCountCompare(workingCase.crimeScenes),
    )

    handleReorder(chron)
    persistOrder(chron)
  }, [handleReorder, orderedCounts, persistOrder, workingCase.crimeScenes])

  const canDelete = orderedCounts.length > 1

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const validIds = new Set(
      (workingCase.indictmentCounts ?? []).map((count) => count.id),
    )

    setExpandedIds((previous) => {
      const next = new Set([...previous].filter((id) => validIds.has(id)))

      return next.size === previous.size ? previous : next
    })
  }, [workingCase.indictmentCounts])

  const allExpanded =
    orderedCounts.length > 0 &&
    orderedCounts.every((count) => expandedIds.has(count.id))

  const handleToggleExpandAll = useCallback(() => {
    if (allExpanded) {
      setExpandedIds(new Set())
      return
    }

    setExpandedIds(new Set(orderedCounts.map((count) => count.id)))
  }, [allExpanded, orderedCounts])

  const handleAccordionToggle = useCallback(
    (indictmentCountId: string, expanded: boolean) => {
      setExpandedIds((previous) => {
        const next = new Set(previous)

        if (expanded) {
          next.add(indictmentCountId)
        } else {
          next.delete(indictmentCountId)
        }

        return next
      })
    },
    [],
  )

  return (
    <Box component="section">
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={3}
      >
        <SectionHeading title="Ákæruliðir" marginBottom={0} />
        {orderedCounts.length > 0 && (
          <Box display="flex" columnGap={2} alignItems="center">
            <Button variant="text" size="small" onClick={handleToggleExpandAll}>
              {allExpanded ? 'Loka öllum' : 'Opna alla'}
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={handleChronologicalSort}
            >
              Raða ákæruliðum í tímaröð
            </Button>
          </Box>
        )}
      </Box>
      <Reorder.Group axis="y" values={orderedCounts} onReorder={handleReorder}>
        <Accordion
          singleExpand={false}
          dividerOnTop={false}
          dividerOnBottom={true}
        >
          {orderedCounts.map((indictmentCount, index) => (
            <IndictmentCountAccordionItem
              key={indictmentCount.id}
              index={index}
              indictmentCount={indictmentCount}
              workingCase={workingCase}
              expanded={expandedIds.has(indictmentCount.id)}
              onToggle={(expanded) =>
                handleAccordionToggle(indictmentCount.id, expanded)
              }
              onReorder={handleDragEnd}
              onDelete={canDelete ? handleDeleteIndictmentCount : undefined}
            >
              <IndictmentCount
                indictmentCount={indictmentCount}
                workingCase={workingCase}
                onDelete={canDelete ? handleDeleteIndictmentCount : undefined}
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
