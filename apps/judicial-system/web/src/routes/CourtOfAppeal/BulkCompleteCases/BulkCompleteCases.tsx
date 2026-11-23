import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useRouter } from 'next/router'

import {
  AlertMessage,
  Box,
  Button,
  Tag,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import {
  CasesLayout,
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

const MODE_SWITCH_DURATION = 1.4
const ROW_MOVE_DURATION = 0.45

type ModalState = 'none' | 'confirm' | 'success'

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

const CaseTable: FC<{
  tableId: string
  cases: MockBulkCase[]
  onRowClick?: (caseRow: MockBulkCase) => void
  emptyMessage?: string
  rowDisabled?: (caseRow: MockBulkCase) => boolean
}> = ({ tableId, cases, onRowClick, emptyMessage, rowDisabled }) => {
  return (
    <div className={styles.gridTable} role="table" aria-label={tableId}>
      {/* Header is outside any layout-animated parent so columns stay fixed. */}
      <div className={styles.gridHeader} role="row">
        {COLUMN_TITLES.map((title) => (
          <div key={title} className={styles.gridHeaderCell} role="columnheader">
            <Text fontWeight="semiBold">{title}</Text>
          </div>
        ))}
        <div className={styles.gridHeaderCell} role="columnheader" />
      </div>
      <div className={styles.gridBody}>
        {cases.map((caseRow) => {
          const disabled = rowDisabled?.(caseRow) ?? false
          const cells = renderCaseCells(caseRow)

          return (
            <motion.div
              key={caseRow.id}
              layoutId={caseRow.id}
              // layout: siblings reflow when a row leaves; layoutId: cross-list move
              layout
              transition={{
                layout: { duration: ROW_MOVE_DURATION, ease: 'easeInOut' },
              }}
              role={onRowClick && !disabled ? 'button' : 'row'}
              tabIndex={onRowClick && !disabled ? 0 : undefined}
              aria-disabled={disabled || undefined}
              aria-label={`Mál ${caseRow.caseNumbers[0]}`}
              className={`${styles.gridRow} ${
                onRowClick ? styles.selectableRow : ''
              }`}
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
              {cells.map((cell, index) => (
                <div key={index} className={styles.gridCell} role="cell">
                  {cell}
                </div>
              ))}
              <div className={styles.gridCell} role="cell" />
            </motion.div>
          )
        })}
        {cases.length === 0 && emptyMessage ? (
          <div className={styles.emptyStaging}>
            <Text variant="small">{emptyMessage}</Text>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const BulkCompleteCases: FC = () => {
  const router = useRouter()
  const [selectionMode, setSelectionMode] = useState(false)
  const [sourceCases, setSourceCases] = useState<MockBulkCase[]>(MOCK_CASES)
  const [stagingCases, setStagingCases] = useState<MockBulkCase[]>([])
  const [completedCases, setCompletedCases] = useState<MockBulkCase[]>([])
  const [modalState, setModalState] = useState<ModalState>('none')

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

  const moveToStaging = (caseRow: MockBulkCase) => {
    if (!caseRow.canComplete) {
      return
    }

    setSourceCases((prev) => prev.filter((c) => c.id !== caseRow.id))
    setStagingCases((prev) => [...prev, caseRow])
  }

  const moveToSource = (caseRow: MockBulkCase) => {
    setStagingCases((prev) => prev.filter((c) => c.id !== caseRow.id))
    setSourceCases((prev) => {
      const next = [...prev, caseRow]
      // Keep original mock order for a stable list while iterating the UI.
      return MOCK_CASES.filter((mock) =>
        next.some((item) => item.id === mock.id),
      )
    })
  }

  const handleToggle = (checked: boolean) => {
    setSelectionMode(checked)
    if (!checked) {
      setSourceCases((prev) => {
        const combined = [...prev, ...stagingCases]
        return MOCK_CASES.filter((mock) =>
          combined.some((item) => item.id === mock.id),
        )
      })
      setStagingCases([])
      setModalState('none')
    }
  }

  const handleConfirmComplete = () => {
    setCompletedCases(stagingCases)
    setStagingCases([])
    setModalState('success')
  }

  const handleCloseSuccess = () => {
    setModalState('none')
    setCompletedCases([])
    setSelectionMode(false)
  }

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
        Avoid overflow:hidden / height / layout on section wrappers — those break
        bidirectional layoutId moves and make column headers stretch.
      */}
      <LayoutGroup>
        <AnimatePresence initial={false}>
          {selectionMode && (
            <motion.div
              key="staging"
              className={styles.stagingSection}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: MODE_SWITCH_DURATION * 0.45,
                ease: 'easeOut',
              }}
            >
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
              <CaseTable
                tableId="staging-cases"
                cases={stagingCases}
                onRowClick={moveToSource}
                emptyMessage={stagingEmptyMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <div className={styles.sectionHeader}>
            <SectionHeading
              title="Mál í dómsuppkvaðningu"
              marginBottom={0}
            />
            <ToggleSwitchCheckbox
              name="select-cases-to-complete"
              label={<Text>Velja mál til að ljúka</Text>}
              checked={selectionMode}
              onChange={handleToggle}
            />
          </div>
          <CaseTable
            tableId="source-cases"
            cases={sourceCases}
            onRowClick={selectionMode ? moveToStaging : undefined}
            rowDisabled={(caseRow) =>
              selectionMode ? !caseRow.canComplete : false
            }
          />
        </div>
      </LayoutGroup>

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
