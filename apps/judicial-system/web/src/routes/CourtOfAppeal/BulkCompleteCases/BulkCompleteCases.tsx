import type { CSSProperties, FC, ReactNode } from 'react'
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/router'
import {
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  type DropAnimation,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
  AlertMessage,
  Box,
  Button,
  Icon,
  Tag,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import {
  CasesLayout,
  ContextMenu,
  type ContextMenuItem,
  Logo,
  Modal,
  PageHeader,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'

import {
  type CaseLists,
  findListId,
  formatCaseCountDative,
  formatCaseNumberList,
  getStagingEmptyMessage,
  LIST_LABELS,
  type ListId,
  moveCaseInLists,
  restoreSourceOrder,
  transferCaseAcrossLists,
} from './BulkCompleteCases.logic'
import { MOCK_CASES, type MockBulkCase } from './mockData'
import * as styles from './BulkCompleteCases.css'

const COLUMN_TITLES = [
  'Málsnúmer',
  'Varnaraðili',
  'Tegund',
  'Dómsuppkvaðning',
  'Staða',
  'Dómsformaður',
] as const

const HEIGHT_EXPAND_DURATION = 0.45
const CONTENT_FADE_DURATION = 0.3
const STAGING_SECTION_GAP = 40

const CLICK_MOVE_DURATION = 1
const EMPTY_FADE_DELAY = 0.12
const EMPTY_FADE_DURATION = 0.2

const DRAG_SCALE = 1.02
const DRAG_SCALE_IN_DURATION = 0.15
const DROP_ANIMATION_DURATION = 300
const EMPTY_BODY_MIN_HEIGHT = 120
const POINTER_ACTIVATION_DISTANCE = 8

const stagingShellVariants = {
  collapsed: {
    height: 0,
    marginBottom: 0,
    transition: {
      height: { duration: HEIGHT_EXPAND_DURATION, ease: 'easeIn' as const },
      marginBottom: {
        duration: HEIGHT_EXPAND_DURATION,
        ease: 'easeIn' as const,
      },
    },
  },
  open: {
    height: 'auto' as const,
    marginBottom: STAGING_SECTION_GAP,
    transition: {
      height: { duration: HEIGHT_EXPAND_DURATION, ease: 'easeOut' as const },
      marginBottom: {
        duration: HEIGHT_EXPAND_DURATION,
        ease: 'easeOut' as const,
      },
    },
  },
}

const stagingContentVariants = (delay: number) => ({
  collapsed: {
    opacity: 0,
    y: 16,
    transition: { duration: CONTENT_FADE_DURATION, ease: 'easeIn' as const },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: CONTENT_FADE_DURATION,
      ease: 'easeOut' as const,
      delay,
    },
  },
})

const stagingHeaderVariants = stagingContentVariants(0.06)
const stagingTableVariants = stagingContentVariants(0.14)

const dropAnimation: DropAnimation = {
  duration: DROP_ANIMATION_DURATION,
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
  keyframes({ transform }) {
    return [
      {
        transform: CSS.Transform.toString({
          ...transform.initial,
          scaleX: DRAG_SCALE,
          scaleY: DRAG_SCALE,
        }),
      },
      {
        transform: CSS.Transform.toString({
          ...transform.final,
          scaleX: 1,
          scaleY: 1,
        }),
      },
    ]
  },
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: '0.35' } },
  }),
}

type ModalState = 'none' | 'confirm' | 'success'

type FlightRect = {
  left: number
  top: number
  width: number
  height: number
}

type ClickFlight = {
  caseRow: MockBulkCase
  fromRect: FlightRect
  frameRect: FlightRect
}

const caseRowSelector = (id: string) => `[data-case-row-id="${id}"]`

const readCaseRowRect = (id: string): FlightRect | null => {
  const el = document.querySelector(caseRowSelector(id))
  if (!el) {
    return null
  }

  const rect = el.getBoundingClientRect()
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  }
}

const lerp = (from: number, to: number, t: number) => from + (to - from) * t

const lerpRect = (from: FlightRect, to: FlightRect, t: number): FlightRect => ({
  left: lerp(from.left, to.left, t),
  top: lerp(from.top, to.top, t),
  width: lerp(from.width, to.width, t),
  height: lerp(from.height, to.height, t),
})

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

const renderLines = (lines: string[], emphasizeFirst = true): ReactNode => (
  <Box display="flex" flexDirection="column">
    {lines.map((line, index) => (
      <Box key={`${line}-${index}`} className={styles.stringGroupItem}>
        {emphasizeFirst && index === 0 ? (
          <Text>{line}</Text>
        ) : (
          <Text as="span" variant="small">
            {line}
          </Text>
        )}
      </Box>
    ))}
  </Box>
)

const renderCaseCells = (caseRow: MockBulkCase): ReactNode[] => {
  const defendantLines = [caseRow.defendantName]
  if (caseRow.defendantDetail) {
    defendantLines.push(caseRow.defendantDetail)
  }

  const typeLines = [caseRow.caseType]
  if (caseRow.caseTypeExtra) {
    typeLines.push(caseRow.caseTypeExtra)
  }

  return [
    renderLines(caseRow.caseNumbers),
    renderLines(defendantLines),
    renderLines(typeLines, typeLines.length === 1),
    renderLines([caseRow.judgmentDate, caseRow.judgmentTime]),
    <Tag key="status" variant={caseRow.statusColor} outlined disabled truncate>
      {caseRow.statusText}
    </Tag>,
    caseRow.judgeInitials ? <Text>{caseRow.judgeInitials}</Text> : null,
  ]
}

const CaseRowCells: FC<{
  caseRow: MockBulkCase
  cellRole?: 'cell'
}> = ({ caseRow, cellRole }) => (
  <>
    {renderCaseCells(caseRow).map((cell, index) => (
      <div key={index} className={styles.gridCell} role={cellRole}>
        {cell}
      </div>
    ))}
  </>
)

const rowMenuItems = (_caseRow: MockBulkCase): ContextMenuItem[] => [
  {
    title: 'Opna mál í nýjum flipa',
    icon: 'open',
    onClick: () => undefined,
  },
]

const CaseRowMenuButton: FC<{ caseRow: MockBulkCase }> = ({ caseRow }) => (
  <ContextMenu
    items={rowMenuItems(caseRow)}
    placement="bottom-end"
    render={
      <button
        type="button"
        className={styles.contextMenuButton}
        aria-label={`Frekari aðgerðir fyrir mál ${caseRow.caseNumbers[0]}`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <Icon icon="ellipsisVertical" color="blue400" size="small" />
      </button>
    }
  />
)

type CaseRowContentProps = {
  caseRow: MockBulkCase
  className?: string
  style?: CSSProperties
  showMenu?: boolean
}

const CaseRowContent = forwardRef<HTMLDivElement, CaseRowContentProps>(
  ({ caseRow, className, style, showMenu = true }, ref) => (
    <div ref={ref} className={className} style={style} role="row">
      <CaseRowCells caseRow={caseRow} cellRole="cell" />
      <div className={`${styles.gridCell} ${styles.menuCell}`} role="cell">
        {showMenu ? <CaseRowMenuButton caseRow={caseRow} /> : null}
      </div>
    </div>
  ),
)

const SortableCaseRow: FC<{
  caseRow: MockBulkCase
  disabled: boolean
  isFlying: boolean
  onRowClick?: (caseRow: MockBulkCase) => void
}> = ({ caseRow, disabled, isFlying, onRowClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: caseRow.id,
    disabled,
    data: { type: 'case', caseId: caseRow.id },
  })

  const canMove = !disabled && Boolean(onRowClick)
  // Keep role="row" for the ARIA table; drop dnd-kit's role="button".
  const { role: _sortableRole, ...sortableAttributes } = attributes

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : undefined,
    width: '100%',
    opacity: isFlying ? 0 : disabled ? 0.7 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      data-case-row-id={caseRow.id}
      style={style}
      role="row"
      aria-label={`Mál ${caseRow.caseNumbers[0]}`}
      className={`${styles.gridRow} ${canMove ? styles.selectableRow : ''} ${
        isDragging ? styles.gridRowDragging : ''
      } ${disabled ? styles.rowDisabled : ''}`}
      {...(canMove ? { ...sortableAttributes, ...listeners } : {})}
      onClick={() => {
        if (canMove && onRowClick) {
          onRowClick(caseRow)
        }
      }}
      onKeyDown={(event) => {
        if (!canMove || !onRowClick) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onRowClick(caseRow)
        }
      }}
    >
      <CaseRowCells caseRow={caseRow} cellRole="cell" />
      <div className={`${styles.gridCell} ${styles.menuCell}`} role="cell">
        <CaseRowMenuButton caseRow={caseRow} />
      </div>
    </div>
  )
}

const BulkCompleteCaseList: FC<{
  listId: ListId
  cases: MockBulkCase[]
  enableDrag: boolean
  flyingCaseId?: string | null
  onRowClick?: (caseRow: MockBulkCase) => void
  emptyMessage?: string
  rowDisabled?: (caseRow: MockBulkCase) => boolean
}> = ({
  listId,
  cases,
  enableDrag,
  flyingCaseId = null,
  onRowClick,
  emptyMessage,
  rowDisabled,
}) => {
  const { setNodeRef } = useDroppable({
    id: listId,
    data: { type: 'list', listId },
    disabled: !enableDrag,
  })

  const measureRef = useRef<HTMLDivElement>(null)
  const [bodyHeight, setBodyHeight] = useState<number | 'auto'>('auto')

  const itemIds = useMemo(() => cases.map((c) => c.id), [cases])
  const showEmpty = cases.length === 0 && Boolean(emptyMessage)

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) {
      return
    }

    const measured = el.offsetHeight
    setBodyHeight((current) => {
      if (current === 'auto' || current !== measured) {
        return measured
      }
      return current
    })
  }, [cases, showEmpty])

  const listBody = (
    <>
      {enableDrag ? (
        <SortableContext
          id={listId}
          items={itemIds}
          strategy={verticalListSortingStrategy}
        >
          {cases.map((caseRow) => {
            const disabled = rowDisabled?.(caseRow) ?? false

            return (
              <SortableCaseRow
                key={caseRow.id}
                caseRow={caseRow}
                disabled={disabled}
                isFlying={flyingCaseId === caseRow.id}
                onRowClick={onRowClick}
              />
            )
          })}
        </SortableContext>
      ) : (
        cases.map((caseRow) => (
          <CaseRowContent
            key={caseRow.id}
            caseRow={caseRow}
            className={styles.gridRow}
          />
        ))
      )}
      <AnimatePresence initial={false}>
        {showEmpty ? (
          <motion.div
            key="empty"
            className={styles.emptyStaging}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                opacity: {
                  duration: EMPTY_FADE_DURATION,
                  delay: EMPTY_FADE_DELAY,
                  ease: 'easeOut',
                },
              },
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Text variant="small">{emptyMessage}</Text>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )

  return (
    <div
      className={styles.gridTable}
      role="table"
      aria-label={LIST_LABELS[listId]}
    >
      <div className={styles.gridHeader} role="row">
        {COLUMN_TITLES.map((title) => (
          <div
            key={title}
            className={styles.gridHeaderCell}
            role="columnheader"
          >
            <Text fontWeight="semiBold">{title}</Text>
          </div>
        ))}
        <div className={styles.gridHeaderCell} role="columnheader" />
      </div>
      <div ref={setNodeRef} className={styles.gridBody}>
        <motion.div
          initial={false}
          animate={{ height: bodyHeight === 'auto' ? undefined : bodyHeight }}
          transition={{
            height: {
              duration: flyingCaseId ? CLICK_MOVE_DURATION : 0.35,
              ease: 'easeInOut',
            },
          }}
          style={{ overflow: 'hidden' }}
        >
          <div
            ref={measureRef}
            style={showEmpty ? { minHeight: EMPTY_BODY_MIN_HEIGHT } : undefined}
          >
            {listBody}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const BulkCompleteCases: FC = () => {
  const router = useRouter()
  const [selectionMode, setSelectionMode] = useState(false)
  const [caseLists, setCaseLists] = useState<CaseLists>({
    staging: [],
    source: MOCK_CASES,
  })
  const { staging: stagingCases, source: sourceCases } = caseLists
  const [completedCases, setCompletedCases] = useState<MockBulkCase[]>([])
  const [modalState, setModalState] = useState<ModalState>('none')
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null)
  const [flyingCaseId, setFlyingCaseId] = useState<string | null>(null)
  const [clickFlight, setClickFlight] = useState<ClickFlight | null>(null)
  const [isStagingAnimating, setIsStagingAnimating] = useState(false)
  const skipClickRef = useRef(false)
  const skipClickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragWasActiveRef = useRef(false)
  const flightFromRectRef = useRef<FlightRect | null>(null)
  const flightRafRef = useRef<number | null>(null)
  // Prevents cross-list dragOver from bouncing the item between lists.
  const recentlyMovedToNewList = useRef(false)
  const didCrossListDuringDrag = useRef(false)
  // Tracks transfers already decided in this drag before React re-renders.
  const caseListsRef = useRef(caseLists)
  caseListsRef.current = caseLists

  const armSkipClick = () => {
    skipClickRef.current = true
    if (skipClickTimeoutRef.current !== null) {
      clearTimeout(skipClickTimeoutRef.current)
    }
    skipClickTimeoutRef.current = setTimeout(() => {
      skipClickRef.current = false
      skipClickTimeoutRef.current = null
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (skipClickTimeoutRef.current !== null) {
        clearTimeout(skipClickTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewList.current = false
    })
  }, [caseLists])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: POINTER_ACTIVATION_DISTANCE },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const stagingCaseNumbers = formatCaseNumberList(stagingCases)
  const completedCaseNumbers = formatCaseNumberList(completedCases)
  const judgmentNotStartedCases = stagingCases.filter(
    (c) => c.judgmentNotStarted,
  )
  const hasSelectableSourceCases = sourceCases.some((c) => c.canComplete)
  const stagingEmptyMessage = getStagingEmptyMessage(hasSelectableSourceCases)

  const activeCase = activeCaseId
    ? stagingCases.find((c) => c.id === activeCaseId) ??
      sourceCases.find((c) => c.id === activeCaseId) ??
      null
    : null

  const moveCaseBetweenLists = (
    caseRow: MockBulkCase,
    from: ListId,
    to: ListId,
  ) => {
    setCaseLists((prev) => moveCaseInLists(prev, caseRow, from, to))
  }

  const clearClickFlight = () => {
    if (flightRafRef.current !== null) {
      cancelAnimationFrame(flightRafRef.current)
      flightRafRef.current = null
    }
    flightFromRectRef.current = null
    setFlyingCaseId(null)
    setClickFlight(null)
  }

  const handleRowClick = (caseRow: MockBulkCase, from: ListId) => {
    if (skipClickRef.current) {
      skipClickRef.current = false
      return
    }

    const to: ListId = from === 'staging' ? 'source' : 'staging'
    const fromRect = readCaseRowRect(caseRow.id)

    if (fromRect) {
      flightFromRectRef.current = fromRect
      setClickFlight({ caseRow, fromRect, frameRect: fromRect })
    }
    setFlyingCaseId(caseRow.id)
    moveCaseBetweenLists(caseRow, from, to)
  }

  // Follow the live destination slot while list heights are still animating.
  useEffect(() => {
    if (!flyingCaseId) {
      return
    }

    const fromRect = flightFromRectRef.current
    if (!fromRect) {
      return
    }

    const startedAt = performance.now()
    const durationMs = CLICK_MOVE_DURATION * 1000
    let lastDest: FlightRect | null = null

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs)
      const eased = easeInOutCubic(progress)
      const liveDest = readCaseRowRect(flyingCaseId)
      if (liveDest) {
        lastDest = liveDest
      }
      const dest = lastDest ?? fromRect

      setClickFlight((prev) => {
        if (!prev || prev.caseRow.id !== flyingCaseId) {
          return prev
        }

        return {
          ...prev,
          frameRect: lerpRect(fromRect, dest, eased),
        }
      })

      if (progress < 1) {
        flightRafRef.current = requestAnimationFrame(tick)
      } else {
        flightRafRef.current = null
        clearClickFlight()
      }
    }

    flightRafRef.current = requestAnimationFrame(tick)

    return () => {
      if (flightRafRef.current !== null) {
        cancelAnimationFrame(flightRafRef.current)
        flightRafRef.current = null
      }
    }
  }, [flyingCaseId])

  const handleToggle = (checked: boolean) => {
    setSelectionMode(checked)
    if (!checked) {
      setCaseLists((prev) => restoreSourceOrder(prev, MOCK_CASES))
      setModalState('none')
      setActiveCaseId(null)
      clearClickFlight()
    }
  }

  const handleConfirmComplete = () => {
    setCompletedCases(stagingCases)
    setCaseLists((prev) => ({ ...prev, staging: [] }))
    setModalState('success')
  }

  const handleCloseSuccess = () => {
    setModalState('none')
    setCompletedCases([])
    setSelectionMode(false)
  }

  const finishActiveDrag = () => {
    if (dragWasActiveRef.current) {
      armSkipClick()
      dragWasActiveRef.current = false
    }
    setActiveCaseId(null)
    didCrossListDuringDrag.current = false
  }

  const handleDragStart = (event: DragStartEvent) => {
    recentlyMovedToNewList.current = false
    didCrossListDuringDrag.current = false
    dragWasActiveRef.current = true
    setActiveCaseId(String(event.active.id))
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || recentlyMovedToNewList.current) {
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)
    const result = transferCaseAcrossLists(
      caseListsRef.current,
      activeId,
      overId,
    )

    if (!result.didTransfer) {
      return
    }

    recentlyMovedToNewList.current = true
    didCrossListDuringDrag.current = true
    caseListsRef.current = result.next
    setCaseLists(result.next)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    finishActiveDrag()

    if (!over) {
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)

    setCaseLists((prev) => {
      const activeList = findListId(activeId, prev.staging, prev.source)
      const overList = findListId(overId, prev.staging, prev.source)

      if (!activeList || !overList || activeList !== overList) {
        return prev
      }

      const items = prev[activeList]
      const oldIndex = items.findIndex((c) => c.id === activeId)
      const newIndex =
        overId === overList
          ? items.length - 1
          : items.findIndex((c) => c.id === overId)

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        return prev
      }

      return {
        ...prev,
        [activeList]: arrayMove(items, oldIndex, newIndex),
      }
    })
  }

  const handleDragCancel = () => {
    finishActiveDrag()
  }

  const listSections = (
    <>
      <AnimatePresence initial={false}>
        {selectionMode && (
          <motion.div
            key="staging"
            className={styles.stagingSection}
            variants={stagingShellVariants}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            style={{
              overflow: isStagingAnimating ? 'hidden' : 'visible',
            }}
            onAnimationStart={() => setIsStagingAnimating(true)}
            onAnimationComplete={() => setIsStagingAnimating(false)}
          >
            <motion.div variants={stagingHeaderVariants}>
              <div className={styles.sectionHeader}>
                <SectionHeading title={LIST_LABELS.staging} marginBottom={0} />
                <Button
                  variant="text"
                  size="small"
                  icon="arrowForward"
                  disabled={stagingCases.length === 0}
                  onClick={() => setModalState('confirm')}
                >
                  Ljúka málum
                </Button>
              </div>
            </motion.div>
            <motion.div variants={stagingTableVariants}>
              <BulkCompleteCaseList
                listId="staging"
                cases={stagingCases}
                enableDrag={selectionMode}
                flyingCaseId={flyingCaseId}
                onRowClick={(caseRow) => handleRowClick(caseRow, 'staging')}
                emptyMessage={stagingEmptyMessage}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <div className={styles.sectionHeader}>
          <SectionHeading title={LIST_LABELS.source} marginBottom={0} />
          <ToggleSwitchCheckbox
            name="select-cases-to-complete"
            label={<Text>Velja mál til að ljúka</Text>}
            checked={selectionMode}
            onChange={handleToggle}
          />
        </div>
        <BulkCompleteCaseList
          listId="source"
          cases={sourceCases}
          enableDrag={selectionMode}
          flyingCaseId={flyingCaseId}
          onRowClick={
            selectionMode
              ? (caseRow) => handleRowClick(caseRow, 'source')
              : undefined
          }
          rowDisabled={(caseRow) =>
            selectionMode ? !caseRow.canComplete : false
          }
        />
      </div>
    </>
  )

  return (
    <CasesLayout>
      <PageHeader title="Mál í dómsuppkvaðningu" />
      <Box marginBottom={5}>
        <Button
          colorScheme="default"
          iconType="filled"
          onClick={() => router.push('/landsrettur/malalistar')}
          preTextIcon="arrowBack"
          preTextIconType="filled"
          type="button"
          variant="text"
        >
          Til baka á yfirlitsskjá
        </Button>
      </Box>
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      {/* Keep mounted so staging enter/exit is not skipped on toggle. */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {listSections}
        {typeof document !== 'undefined' &&
          createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
              {activeCase ? (
                <motion.div
                  className={styles.dragPreviewMotion}
                  initial={{ scale: 1 }}
                  animate={{ scale: DRAG_SCALE }}
                  transition={{
                    duration: DRAG_SCALE_IN_DURATION,
                    ease: 'easeOut',
                  }}
                >
                  <CaseRowContent
                    caseRow={activeCase}
                    className={styles.dragPreview}
                    showMenu={false}
                  />
                </motion.div>
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        {typeof document !== 'undefined' &&
          clickFlight &&
          createPortal(
            <div
              className={styles.clickFlight}
              style={{
                left: clickFlight.frameRect.left,
                top: clickFlight.frameRect.top,
                width: clickFlight.frameRect.width,
                height: clickFlight.frameRect.height,
              }}
            >
              <CaseRowContent
                caseRow={clickFlight.caseRow}
                className={styles.gridRow}
                showMenu={false}
              />
            </div>,
            document.body,
          )}
      </DndContext>

      <AnimatePresence>
        {modalState === 'confirm' && (
          <Modal
            title="Viltu ljúka málunum?"
            text={
              <Box>
                <Text>
                  {`Dómsúrlausnir og tilkynningar verða sendar í ${formatCaseCountDative(
                    stagingCases.length,
                  )}: ${stagingCaseNumbers}.`}
                </Text>
                {judgmentNotStartedCases.length > 0 && (
                  <Box marginTop={3}>
                    <AlertMessage
                      type="warning"
                      message={`Dómsuppkvaðning er ekki hafin í eftirfarandi málum: ${judgmentNotStartedCases
                        .map(
                          (c) =>
                            `${c.caseNumbers[0]} (${c.judgmentDate} ${c.judgmentTime})`,
                        )
                        .join(', ')}.`}
                    />
                  </Box>
                )}
              </Box>
            }
            onClose={() => setModalState('none')}
            buttons={[
              {
                text: 'Hætta við',
                onClick: () => setModalState('none'),
                variant: 'ghost',
              },
              {
                text: 'Já, ljúka málum',
                onClick: handleConfirmComplete,
              },
            ]}
          />
        )}
        {modalState === 'success' && (
          <Modal
            title="Málunum er lokið"
            text={`Dómsúrlausnir og tilkynningar hafa verið sendar í ${formatCaseCountDative(
              completedCases.length,
            )}: ${completedCaseNumbers}.`}
            onClose={handleCloseSuccess}
            buttons={[
              {
                text: 'Loka',
                onClick: handleCloseSuccess,
              },
            ]}
          />
        )}
      </AnimatePresence>
    </CasesLayout>
  )
}

export default BulkCompleteCases
