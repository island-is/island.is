import type { FC, MouseEvent, ReactNode } from 'react'
import { useRef, useState } from 'react'
import { AnimatePresence, useIsPresent } from 'motion/react'

import {
  AlertMessage,
  Button,
  Text,
  ToggleSwitchCheckbox,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import {
  Modal,
  SectionHeading,
  useOpenCaseInNewTab,
} from '@island.is/judicial-system-web/src/components'
import ExpandingSection from '@island.is/judicial-system-web/src/components/Motion/ExpandingSection'
import { GenericTable } from '@island.is/judicial-system-web/src/components/Table'
import type { CaseTableRow } from '@island.is/judicial-system-web/src/graphql/schema'
import * as caseTableStyles from '@island.is/judicial-system-web/src/routes/Shared/CaseTable/CaseTable.css'
import {
  compare,
  render,
} from '@island.is/judicial-system-web/src/routes/Shared/CaseTable/caseTableCells'
import { compareArrays } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import {
  formatCaseCountDative,
  formatCaseNumberList,
  getColumnWidth,
  getMoveAnnouncement,
  getRowActionLabel,
  getRowId,
  getRowLabel,
  partitionRows,
  stageCase,
  unstageCase,
} from './BulkCompleteCases.logic'
import * as styles from './BulkCompleteCases.css'

interface Props {
  rows: CaseTableRow[]
  columns: { title: string }[]
  onComplete: (rows: CaseTableRow[]) => Promise<void>
}

type ModalState = 'none' | 'confirm' | 'success'

// A closing block is kept on the page from the props it had when it was last
// shown, so its content cannot be told about the change through props. This
// hands that content whether the block is still on the page.
const WithPresence: FC<{ children: (isPresent: boolean) => ReactNode }> = ({
  children,
}) => {
  const isPresent = useIsPresent()

  return children(isPresent)
}

// The nearest row in the given direction that is not fading out of its list.
const findLiveRow = (
  row: HTMLTableRowElement,
  direction: 'nextElementSibling' | 'previousElementSibling',
): HTMLTableRowElement | undefined => {
  let sibling = row[direction]

  while (sibling) {
    if (
      sibling instanceof HTMLTableRowElement &&
      !sibling.hasAttribute('data-exiting')
    ) {
      return sibling
    }

    sibling = sibling[direction]
  }

  return undefined
}

// Opens and closes on the same timing as the rows of the list above it, so
// the last row leaving and the box arriving move together.
const EmptyList: FC<{ show: boolean; text: string }> = ({ show, text }) => (
  <ExpandingSection show={show}>
    <div className={styles.emptyListSpacing}>
      <div className={styles.emptyList}>
        <Text variant="small">{text}</Text>
      </div>
    </div>
  </ExpandingSection>
)

const BulkCompleteCaseLists: FC<Props> = ({ rows, columns, onComplete }) => {
  const { openCaseInNewTab } = useOpenCaseInNewTab()
  const {
    isOpeningCaseId,
    isOpeningDefendantIds,
    isOpeningAppealCaseId,
    handleOpenCase,
    LoadingIndicator,
    showLoading,
  } = useCaseList()
  const [selectionMode, setSelectionMode] = useState(false)
  const [stagedIds, setStagedIds] = useState<string[]>([])
  const [modal, setModal] = useState<ModalState>('none')
  const [completedRows, setCompletedRows] = useState<CaseTableRow[]>([])
  const [isCompleting, setIsCompleting] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const toggleContainerRef = useRef<HTMLDivElement>(null)
  // Set synchronously, so a second click on the confirm button before the
  // re-render that disables it still sends nothing.
  const isCompletingRef = useRef(false)

  const { staged, source } = partitionRows(rows, stagedIds)

  const tableColumns = columns.map((c, idx) => ({
    title: c.title,
    width: getColumnWidth(idx, columns.length),
    compare,
    render,
  }))

  const handleToggle = (checked: boolean) => {
    setSelectionMode(checked)

    if (!checked) {
      setStagedIds([])
    }
  }

  // A row moved with the keyboard leaves its list, taking focus with it, so
  // focus goes to the row that takes its place, or to the selection toggle
  // when the list is left empty. Rows still fading out of the list are
  // passed over.
  const moveFocusFromMovedRow = () => {
    const movedRow = document.activeElement

    if (!(movedRow instanceof HTMLTableRowElement)) {
      return
    }

    const nextRow =
      findLiveRow(movedRow, 'nextElementSibling') ??
      findLiveRow(movedRow, 'previousElementSibling')

    if (nextRow) {
      nextRow.focus()
      return
    }

    toggleContainerRef.current?.querySelector('input')?.focus()
  }

  const moveCase = (
    row: CaseTableRow,
    isStaged: boolean,
    event?: MouseEvent<HTMLTableRowElement>,
  ) => {
    // The second click of a double click lands on whatever row has slid in
    // under the pointer, so only the first click moves a case.
    if (event && event.detail > 1) {
      return
    }

    const rowId = getRowId(row)

    if (!event) {
      moveFocusFromMovedRow()
    }

    setAnnouncement(
      getMoveAnnouncement(isStaged ? 'unstage' : 'stage', getRowLabel(row)),
    )
    setStagedIds((prev) =>
      isStaged ? unstageCase(prev, rowId) : stageCase(prev, rows, rowId),
    )
  }

  const getTableRow = (
    r: CaseTableRow,
    isStaged: boolean,
    isInteractive = true,
  ) => {
    const label = getRowLabel(r)
    const common = {
      id: getRowId(r),
      cells: r.cells,
      contextMenuItems: [openCaseInNewTab(r.caseId, r.appealCaseId)],
      label,
    }

    if (selectionMode) {
      return {
        ...common,
        onClick: (event?: MouseEvent<HTMLTableRowElement>) =>
          moveCase(r, isStaged, event),
        isDisabled: !isInteractive,
        isLoading: false,
        actionLabel: getRowActionLabel(isStaged ? 'unstage' : 'stage', label),
      }
    }

    const isOpening =
      isOpeningCaseId === r.caseId &&
      compareArrays(isOpeningDefendantIds, r.defendantIds) &&
      isOpeningAppealCaseId === r.appealCaseId

    return {
      ...common,
      onClick: () =>
        handleOpenCase(r.caseId, false, r.defendantIds, r.appealCaseId),
      isDisabled: !isInteractive || isOpening,
      isLoading: isOpening && showLoading,
      actionLabel: getRowActionLabel('open', label),
    }
  }

  const handleConfirm = async () => {
    if (isCompletingRef.current) {
      return
    }

    isCompletingRef.current = true
    setIsCompleting(true)

    try {
      await onComplete(staged)
      setCompletedRows(staged)
      setModal('success')
    } catch {
      setModal('none')
      toast.error('Ekki tókst að ljúka málum. Vinsamlega reynið aftur.')
    } finally {
      isCompletingRef.current = false
      setIsCompleting(false)
    }
  }

  const handleCloseSuccess = () => {
    setModal('none')
    setCompletedRows([])
    setStagedIds([])
    setSelectionMode(false)
  }

  const emptyState = (
    <div className={stack({ gap: 3 })}>
      <SectionHeading title="Mál í dómsuppkvaðningu" marginBottom={0} />
      <div className={caseTableStyles.infoContainer}>
        <AlertMessage
          type="info"
          title="Engin mál fundust"
          message="Engin mál fundust í þessum flokki"
        />
      </div>
    </div>
  )

  return (
    <>
      <VisuallyHidden>
        <span aria-live="polite">{announcement}</span>
      </VisuallyHidden>
      {rows.length === 0 ? (
        emptyState
      ) : (
        <div>
          <ExpandingSection show={selectionMode}>
            <WithPresence>
              {(isPresent) => (
                // While the section closes, its rows no longer respond: the
                // same cases are back in the list below.
                <div className={stack({ gap: 3 })} inert={!isPresent}>
                  <div className={styles.sectionHeader}>
                    <SectionHeading title="Mál til að ljúka" marginBottom={0} />
                    <Button
                      variant="text"
                      icon="arrowForward"
                      disabled={!isPresent || staged.length === 0}
                      onClick={() => setModal('confirm')}
                    >
                      Ljúka málum
                    </Button>
                  </div>
                  <div className={styles.stagingSection}>
                    <GenericTable
                      tableId="bulk-complete-cases-staged"
                      columns={tableColumns}
                      rows={staged.map((r) => getTableRow(r, true, isPresent))}
                      loadingIndicator={LoadingIndicator}
                      fadeRows
                      fixedLayout
                      sortable={staged.length > 0}
                    />
                    <EmptyList
                      show={staged.length === 0}
                      text="Engin mál valin – smelltu á mál til að velja það"
                    />
                  </div>
                </div>
              )}
            </WithPresence>
          </ExpandingSection>
          <div className={stack({ gap: 3 })}>
            <div className={styles.sectionHeader}>
              <SectionHeading title="Mál í dómsuppkvaðningu" marginBottom={0} />
              <div ref={toggleContainerRef}>
                <ToggleSwitchCheckbox
                  name="select-cases-to-complete"
                  label={<Text>Velja mál til að ljúka</Text>}
                  checked={selectionMode}
                  onChange={handleToggle}
                />
              </div>
            </div>
            <div>
              <GenericTable
                tableId="bulk-complete-cases-source"
                columns={tableColumns}
                rows={source.map((r) => getTableRow(r, false))}
                loadingIndicator={LoadingIndicator}
                fadeRows
                fixedLayout
                sortable={source.length > 0}
              />
              <EmptyList show={source.length === 0} text="Öll mál valin" />
            </div>
          </div>
        </div>
      )}
      <AnimatePresence mode="wait">
        {modal === 'confirm' && (
          <Modal
            key="confirm"
            title="Viltu ljúka málunum?"
            text={`Áfrýjun verður lokið í ${formatCaseCountDative(
              staged.length,
            )}: ${formatCaseNumberList(staged)}.`}
            onClose={() => setModal('none')}
            loading={isCompleting}
            buttons={[
              {
                text: 'Hætta við',
                onClick: () => setModal('none'),
                variant: 'ghost',
              },
              {
                text: 'Já, ljúka málum',
                onClick: handleConfirm,
              },
            ]}
          />
        )}
        {modal === 'success' && (
          <Modal
            key="success"
            title="Málunum er lokið"
            text={`Áfrýjun er lokið í ${formatCaseCountDative(
              completedRows.length,
            )}: ${formatCaseNumberList(completedRows)}.`}
            onClose={handleCloseSuccess}
            buttons={[{ text: 'Loka', onClick: handleCloseSuccess }]}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default BulkCompleteCaseLists
