import type { CSSProperties, FC, KeyboardEvent, ReactNode } from 'react'
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
  type UniqueIdentifier,
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

// Mode switch: Figma is 1.4s with a ~0.5s hold — we start immediately (product ask)
// but keep a short header → table stagger inside the expand.
const HEIGHT_EXPAND_DURATION = 0.45
const CONTENT_FADE_DURATION = 0.3
const STAGING_SECTION_GAP = 40

// Click-to-move (Figma Motion - Smella…): 1.0s row flight; empty fades ~12–32%.
const CLICK_MOVE_DURATION = 1
const EMPTY_FADE_DELAY = 0.12
const EMPTY_FADE_DURATION = 0.2

// Drag-and-drop (Figma Motion - Draga…): 1.2s with scale bump 1 → 1.02 → 1.
const DRAG_SCALE = 1.02
const DRAG_SCALE_IN_DURATION = 0.15
const DROP_ANIMATION_DURATION = 300

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

const stagingHeaderVariants = {
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
      delay: 0.06,
    },
  },
}

const stagingTableVariants = {
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
      delay: 0.14,
    },
  },
}

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
type ListId = 'staging' | 'source'

type FlightRect = {
  left: number
  top: number
  width: number
  height: number
}

type ClickFlight = {
  caseRow: MockBulkCase
  fromRect: FlightRect
  toRect: FlightRect | null
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
    <Tag
      key="status"
      variant={caseRow.statusColor}
      outlined
      disabled
      truncate
    >
      {caseRow.statusText}
    </Tag>,
    caseRow.judgeInitials ? <Text>{caseRow.judgeInitials}</Text> : null,
  ]
}

const rowMenuItems = (_caseRow: MockBulkCase): ContextMenuItem[] => [
  {
    title: 'Opna mál í nýjum flipa',
    icon: 'open',
    // Mock UI — real open-case wiring lands with the API PR.
    onClick: () => undefined,
  },
]

type CaseRowContentProps = {
  caseRow: MockBulkCase
  className?: string
  style?: CSSProperties
  role?: string
  tabIndex?: number
  showMenu?: boolean
  'aria-disabled'?: boolean
  'aria-label'?: string
  onClick?: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
} & Record<string, unknown>

const CaseRowContent = forwardRef<HTMLDivElement, CaseRowContentProps>(
  (
    {
      caseRow,
      className,
      style,
      role,
      tabIndex,
      showMenu = true,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const cells = renderCaseCells(caseRow)

    return (
      // Interactive rows pass role="button" + keyboard handlers from SortableCaseRow.
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={ref}
        className={className}
        style={style}
        role={role ?? (onClick ? 'button' : undefined)}
        tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {cells.map((cell, index) => (
          <div key={index} className={styles.gridCell} role="cell">
            {cell}
          </div>
        ))}
        <div className={`${styles.gridCell} ${styles.menuCell}`} role="cell">
          {showMenu ? (
            // Stop pointer events from reaching the row drag listeners / click-to-move.
             
            <div onPointerDown={(event) => event.stopPropagation()}>
              <ContextMenu
                items={rowMenuItems(caseRow)}
                placement="bottom-end"
                render={
                  // MenuButton owns a11y; stopPropagation keeps row click-to-move from firing.
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Ariakit MenuButton
                  <div
                    className={styles.contextMenuButton}
                    aria-label={`Frekari aðgerðir fyrir mál ${caseRow.caseNumbers[0]}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Icon
                      icon="ellipsisVertical"
                      color="blue400"
                      size="small"
                    />
                  </div>
                }
              />
            </div>
          ) : null}
        </div>
      </div>
    )
  },
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

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : undefined,
    width: '100%',
    // Slot stays for list height tween; portaled clone is the visible flight.
    opacity: isFlying ? 0 : undefined,
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- role=button + key handlers
    <div
      ref={setNodeRef}
      data-case-row-id={caseRow.id}
      style={style}
      className={!disabled ? styles.selectableRow : undefined}
      role={!disabled ? 'button' : 'row'}
      tabIndex={!disabled ? 0 : undefined}
      aria-disabled={disabled || undefined}
      aria-label={`Mál ${caseRow.caseNumbers[0]}`}
      {...attributes}
      {...(!disabled ? listeners : {})}
      onClick={() => {
        if (!disabled && onRowClick) {
          onRowClick(caseRow)
        }
      }}
      onKeyDown={(event) => {
        if (
          (event.key === 'Enter' || event.key === ' ') &&
          !disabled &&
          onRowClick
        ) {
          event.preventDefault()
          onRowClick(caseRow)
        }
      }}
    >
      <CaseRowContent
        caseRow={caseRow}
        className={`${styles.gridRow} ${
          isDragging ? styles.gridRowDragging : ''
        }`}
        role="presentation"
        showMenu
      />
    </div>
  )
}

const EMPTY_BODY_MIN_HEIGHT = 120

const CaseTable: FC<{
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

  // Animate real document-flow height so the other list is pushed gradually
  // (Figma), instead of snapping when a row mounts/unmounts.
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
            role="row"
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
    <div className={styles.gridTable} role="table" aria-label={listId}>
      <div className={styles.gridHeader} role="row">
        {COLUMN_TITLES.map((title) => (
          <div key={title} className={styles.gridHeaderCell} role="columnheader">
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
          // Real height tween (not transform layout) so siblings are pushed in
          // document flow. Clip so incoming rows reveal with the grow.
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

const findListId = (
  id: UniqueIdentifier,
  stagingCases: MockBulkCase[],
  sourceCases: MockBulkCase[],
): ListId | undefined => {
  if (id === 'staging' || id === 'source') {
    return id
  }

  if (stagingCases.some((c) => c.id === id)) {
    return 'staging'
  }

  if (sourceCases.some((c) => c.id === id)) {
    return 'source'
  }

  return undefined
}

type CaseLists = {
  staging: MockBulkCase[]
  source: MockBulkCase[]
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
  const skipClickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const flyingClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  // Cross-list moves in onDragOver re-run collision detection; without this
  // guard the item can bounce between lists and blow the update depth limit.
  const recentlyMovedToNewList = useRef(false)
  const didCrossListDuringDrag = useRef(false)

  const armSkipClick = () => {
    skipClickRef.current = true
    if (skipClickTimeoutRef.current !== null) {
      clearTimeout(skipClickTimeoutRef.current)
    }
    // Clear after the browser's post-drag click so a later real click works.
    skipClickTimeoutRef.current = setTimeout(() => {
      skipClickRef.current = false
      skipClickTimeoutRef.current = null
    }, 100)
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewList.current = false
    })
  }, [caseLists])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const stagingCaseNumbers = useMemo(
    () => stagingCases.map((c) => c.caseNumbers[0]).join(' og '),
    [stagingCases],
  )

  const completedCaseNumbers = useMemo(
    () => completedCases.map((c) => c.caseNumbers[0]).join(' og '),
    [completedCases],
  )

  const judgmentNotStartedCases = useMemo(
    () => stagingCases.filter((c) => c.judgmentNotStarted),
    [stagingCases],
  )

  const hasSelectableSourceCases = useMemo(
    () => sourceCases.some((c) => c.canComplete),
    [sourceCases],
  )

  const stagingEmptyMessage = hasSelectableSourceCases
    ? 'Engin mál valin – smelltu á mál eða dragðu þau hingað'
    : 'Engin mál tilbúin – staðfesta þarf dóm eða úrskurð áður en hægt er að ljúka máli'

  const activeCase = useMemo(() => {
    if (!activeCaseId) {
      return null
    }

    return (
      stagingCases.find((c) => c.id === activeCaseId) ??
      sourceCases.find((c) => c.id === activeCaseId) ??
      null
    )
  }, [activeCaseId, stagingCases, sourceCases])

  const moveCaseBetweenLists = (
    caseRow: MockBulkCase,
    from: ListId,
    to: ListId,
  ) => {
    if (from === to) {
      return
    }

    if (to === 'staging' && !caseRow.canComplete) {
      return
    }

    setCaseLists((prev) => {
      const fromItems = prev[from].filter((c) => c.id !== caseRow.id)
      const toItems = [...prev[to], caseRow]
      return { ...prev, [from]: fromItems, [to]: toItems }
    })
  }

  const clearClickFlight = () => {
    setFlyingCaseId(null)
    setClickFlight(null)
    if (flyingClearTimeoutRef.current !== null) {
      clearTimeout(flyingClearTimeoutRef.current)
      flyingClearTimeoutRef.current = null
    }
  }

  const handleRowClick = (caseRow: MockBulkCase, from: ListId) => {
    if (skipClickRef.current) {
      skipClickRef.current = false
      return
    }

    const to: ListId = from === 'staging' ? 'source' : 'staging'
    // Capture source rect before state moves the row out of this list.
    const fromRect = readCaseRowRect(caseRow.id)

    if (fromRect) {
      setClickFlight({ caseRow, fromRect, toRect: null })
    }
    setFlyingCaseId(caseRow.id)
    moveCaseBetweenLists(caseRow, from, to)
  }

  // Aim the portal after the row has committed in the destination list.
  // (Measuring before the move locked onto the source rect — hover in place.)
  useLayoutEffect(() => {
    if (!flyingCaseId) {
      return
    }

    setClickFlight((prev) => {
      if (!prev || prev.caseRow.id !== flyingCaseId || prev.toRect) {
        return prev
      }

      const toRect = readCaseRowRect(flyingCaseId)
      if (!toRect) {
        return prev
      }

      const travel = Math.hypot(
        toRect.left - prev.fromRect.left,
        toRect.top - prev.fromRect.top,
      )
      // Still the pre-move node if travel is ~0; wait for the next commit.
      if (travel < 8) {
        return prev
      }

      return { ...prev, toRect }
    })
  }, [caseLists, flyingCaseId])

  // End the flight after the move animation — clock starts when we have a target.
  useEffect(() => {
    if (!clickFlight?.toRect) {
      return
    }

    if (flyingClearTimeoutRef.current !== null) {
      clearTimeout(flyingClearTimeoutRef.current)
    }
    flyingClearTimeoutRef.current = setTimeout(() => {
      clearClickFlight()
    }, CLICK_MOVE_DURATION * 1000)

    return () => {
      if (flyingClearTimeoutRef.current !== null) {
        clearTimeout(flyingClearTimeoutRef.current)
        flyingClearTimeoutRef.current = null
      }
    }
  }, [clickFlight?.toRect])

  const handleToggle = (checked: boolean) => {
    setSelectionMode(checked)
    if (!checked) {
      setCaseLists((prev) => {
        const combined = [...prev.source, ...prev.staging]
        return {
          staging: [],
          source: MOCK_CASES.filter((mock) =>
            combined.some((item) => item.id === mock.id),
          ),
        }
      })
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

  const handleDragStart = (event: DragStartEvent) => {
    recentlyMovedToNewList.current = false
    didCrossListDuringDrag.current = false
    setActiveCaseId(String(event.active.id))
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || recentlyMovedToNewList.current) {
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)

    setCaseLists((prev) => {
      const activeList = findListId(activeId, prev.staging, prev.source)
      const overList = findListId(overId, prev.staging, prev.source)

      if (!activeList || !overList || activeList === overList) {
        return prev
      }

      const activeItems = prev[activeList]
      const overItems = prev[overList]
      const activeIndex = activeItems.findIndex((c) => c.id === activeId)
      if (activeIndex < 0) {
        return prev
      }

      const moving = activeItems[activeIndex]
      if (overList === 'staging' && !moving.canComplete) {
        return prev
      }

      // Already moved into the other list in a previous dragOver tick.
      if (overItems.some((c) => c.id === activeId)) {
        return prev
      }

      const overIndex =
        overId === overList
          ? overItems.length
          : overItems.findIndex((c) => c.id === overId)

      const insertIndex = overIndex < 0 ? overItems.length : overIndex

      recentlyMovedToNewList.current = true
      didCrossListDuringDrag.current = true

      return {
        ...prev,
        [activeList]: activeItems.filter((c) => c.id !== activeId),
        [overList]: [
          ...overItems.slice(0, insertIndex),
          moving,
          ...overItems.slice(insertIndex),
        ],
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event
    setActiveCaseId(null)

    // Suppress the trailing click after a real drag, or after a cross-list
    // drop (click would bounce the row back). Tiny no-op drags still click-move.
    const dragDistance = Math.hypot(delta.x, delta.y)
    if (didCrossListDuringDrag.current || dragDistance > 12) {
      armSkipClick()
    }
    didCrossListDuringDrag.current = false

    if (!over) {
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)

    setCaseLists((prev) => {
      const activeList = findListId(activeId, prev.staging, prev.source)
      const overList = findListId(overId, prev.staging, prev.source)

      if (!activeList || !overList || activeList !== overList) {
        // Cross-list moves are applied in onDragOver.
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
    setActiveCaseId(null)
    armSkipClick()
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
            // Clip only while opening/closing so layoutId row flights aren't cropped.
            style={{
              overflow: isStagingAnimating ? 'hidden' : 'visible',
            }}
            onAnimationStart={() => setIsStagingAnimating(true)}
            onAnimationComplete={() => setIsStagingAnimating(false)}
          >
            <motion.div variants={stagingHeaderVariants}>
              <div className={styles.sectionHeader}>
                <SectionHeading title="Mál til að ljúka" marginBottom={0} />
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
              <CaseTable
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
          <SectionHeading title="Mál í dómsuppkvaðningu" marginBottom={0} />
          <ToggleSwitchCheckbox
            name="select-cases-to-complete"
            label={<Text>Velja mál til að ljúka</Text>}
            checked={selectionMode}
            onChange={handleToggle}
          />
        </div>
        <CaseTable
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

      {/*
        Keep DndContext mounted across the selection-mode toggle. Swapping the
        tree remounts AnimatePresence and skips enter/exit on the staging block.
      */}
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
            <motion.div
              key={clickFlight.caseRow.id}
              className={styles.clickFlight}
              initial={{
                left: clickFlight.fromRect.left,
                top: clickFlight.fromRect.top,
                width: clickFlight.fromRect.width,
                height: clickFlight.fromRect.height,
              }}
              animate={
                clickFlight.toRect
                  ? {
                      left: clickFlight.toRect.left,
                      top: clickFlight.toRect.top,
                      width: clickFlight.toRect.width,
                      height: clickFlight.toRect.height,
                    }
                  : {
                      left: clickFlight.fromRect.left,
                      top: clickFlight.fromRect.top,
                      width: clickFlight.fromRect.width,
                      height: clickFlight.fromRect.height,
                    }
              }
              transition={{
                duration: CLICK_MOVE_DURATION,
                ease: 'easeInOut',
              }}
            >
              <CaseRowContent
                caseRow={clickFlight.caseRow}
                className={styles.gridRow}
                showMenu={false}
              />
            </motion.div>,
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
                  {`Dómsúrlausnir og tilkynningar verða sendar í ${stagingCases.length} málum: ${stagingCaseNumbers}.`}
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
            text={`Dómsúrlausnir og tilkynningar hafa verið sendar í ${completedCases.length} málum: ${completedCaseNumbers}.`}
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
