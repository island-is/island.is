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

  const handleReorder = useCallback((newOrder: TIndictmentCount[]) => {
    reorderableCountsRef.current = newOrder
    setReorderableCounts(newOrder)
  }, [])

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

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const validIds = new Set(reorderableCounts.map((count) => count.id))

    setExpandedIds((previous) => {
      const next = new Set([...previous].filter((id) => validIds.has(id)))

      return next.size === previous.size ? previous : next
    })
  }, [reorderableCounts])

  const allExpanded =
    reorderableCounts.length > 0 &&
    reorderableCounts.every((count) => expandedIds.has(count.id))

  const handleToggleExpandAll = useCallback(() => {
    if (allExpanded) {
      setExpandedIds(new Set())
      return
    }

    setExpandedIds(new Set(reorderableCounts.map((count) => count.id)))
  }, [allExpanded, reorderableCounts])

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
        <SectionHeading
          title={formatMessage(strings.indictmentCountsTitle)}
          marginBottom={0}
        />
        {reorderableCounts.length > 0 && (
          <Box display="flex" columnGap={2} alignItems="center">
            <Button variant="text" onClick={handleToggleExpandAll}>
              {formatMessage(
                allExpanded
                  ? strings.collapseAllIndictmentCounts
                  : strings.expandAllIndictmentCounts,
              )}
            </Button>
            <Button variant="text" onClick={handleChronologicalSort}>
              {formatMessage(strings.sortIndictmentCountsChronologically)}
            </Button>
          </Box>
        )}
      </Box>
      <Reorder.Group
        axis="y"
        values={reorderableCounts}
        onReorder={handleReorder}
      >
        <Accordion
          singleExpand={false}
          dividerOnTop={false}
          dividerOnBottom={true}
        >
          {reorderableCounts.map((indictmentCount, index) => (
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
