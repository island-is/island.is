import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import { Box, toast } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core, errors, tables } from '@island.is/judicial-system-web/messages'
import {
  FormContext,
  Modal,
  SectionHeading,
  TagCaseState,
  useOpenCaseInNewTab,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CourtDate,
  DefendantInfo,
  TableDate,
} from '@island.is/judicial-system-web/src/components/Table'
import Table, {
  TableWrapper,
} from '@island.is/judicial-system-web/src/components/Table/Table'
import TableInfoContainer from '@island.is/judicial-system-web/src/components/Table/TableInfoContainer/TableInfoContainer'
import {
  Case,
  CaseIndictmentRulingDecision,
  CaseListEntry,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import CourtCaseNumberInput from '../CourtCaseNumber/CourtCaseNumberInput'
import { strings } from './CasesInProgressTable.strings'

interface CasesInProgressTableProps {
  loading: boolean
  isFiltering: boolean
  cases: CaseListEntry[]
  refetch: () => Promise<unknown>
}

const CasesInProgressTable: FC<CasesInProgressTableProps> = (props) => {
  const { loading, isFiltering, cases, refetch } = props

  const { formatMessage } = useIntl()
  const { openCaseInNewTab } = useOpenCaseInNewTab()
  const { getCase } = useContext(FormContext)
  const [caseToCancelId, setCaseToCancelId] = useState<string>()
  const [caseToCancel, setCaseToCancel] = useState<Case>()
  const { updateCase, isUpdatingCase, transitionCase, isTransitioningCase } =
    useCase()

  useEffect(() => {
    if (caseToCancelId) {
      getCase(caseToCancelId, setCaseToCancel, () =>
        toast.error(formatMessage(errors.getCaseToOpen)),
      )
    }
  }, [caseToCancelId, formatMessage, getCase])

  const handlePrimaryButtonClick = async () => {
    if (!caseToCancelId) {
      return
    }

    const updated = await updateCase(caseToCancelId, {
      indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
    })

    if (!updated) {
      return
    }

    const cancelled = await transitionCase(
      caseToCancelId,
      CaseTransition.COMPLETE,
    )

    if (!cancelled) {
      return
    }

    refetch()

    setCaseToCancelId(undefined)
  }

  const handleSecondaryButtonClick = () => {
    setCaseToCancelId(undefined)
  }

  return (
    <section>
      <SectionHeading title={formatMessage(strings.title)} />
      <AnimatePresence initial={false}>
        <TableWrapper loading={loading || isFiltering}>
          {cases.length > 0 ? (
            <Table
              thead={[
                {
                  title: formatMessage(tables.caseNumber),
                  sortBy: 'courtCaseNumber',
                  sortFn: 'number',
                },
                {
                  title: capitalize(
                    formatMessage(core.defendant, { suffix: 'i' }),
                  ),
                  sortBy: 'defendants',
                },
                { title: formatMessage(tables.type) },
                {
                  title: capitalize(formatMessage(tables.sentToCourtDate)),
                  sortBy: 'caseSentToCourtDate',
                },
                { title: formatMessage(tables.state), sortBy: 'state' },
                {
                  title: formatMessage(tables.hearingArrangementDate),
                  sortBy: 'courtDate',
                },
              ]}
              data={cases}
              columns={[
                {
                  cell: (row) => (
                    <CourtCaseNumber
                      courtCaseNumber={row.courtCaseNumber ?? ''}
                      policeCaseNumbers={row.policeCaseNumbers ?? []}
                      appealCaseNumber={row.appealCaseNumber ?? ''}
                    />
                  ),
                },
                {
                  cell: (row) => <DefendantInfo defendants={row.defendants} />,
                },
                {
                  cell: (row) => (
                    <ColumnCaseType
                      type={row.type}
                      decision={row.decision}
                      parentCaseId={row.parentCaseId}
                    />
                  ),
                },
                {
                  cell: (row) => (
                    <TableDate displayDate={row.caseSentToCourtDate} />
                  ),
                },
                {
                  cell: (row) => <TagCaseState theCase={row} />,
                },
                {
                  cell: (row) =>
                    row.state === CaseState.WAITING_FOR_CANCELLATION ? null : (
                      <CourtDate
                        courtDate={row.courtDate}
                        postponedIndefinitelyExplanation={
                          row.postponedIndefinitelyExplanation
                        }
                        courtSessionType={row.courtSessionType}
                      />
                    ),
                },
              ]}
              generateContextMenuItems={(row) => {
                return row.state === CaseState.WAITING_FOR_CANCELLATION
                  ? []
                  : [openCaseInNewTab(row.id)]
              }}
              onClick={(row) => {
                if (row.state === CaseState.WAITING_FOR_CANCELLATION) {
                  setCaseToCancelId(row.id)
                  return true
                }

                return false
              }}
            />
          ) : (
            <TableInfoContainer
              title={formatMessage(strings.noCasesTitle)}
              message={formatMessage(strings.noCasesMessage)}
            />
          )}
        </TableWrapper>
      </AnimatePresence>
      {caseToCancel && caseToCancel.id === caseToCancelId && (
        <Modal
          title={formatMessage(strings.cancelCaseModalTitle)}
          text={formatMessage(strings.cancelCaseModalText)}
          primaryButtonText={formatMessage(
            strings.cancelCaseModalPrimaryButtonText,
          )}
          onPrimaryButtonClick={handlePrimaryButtonClick}
          isPrimaryButtonLoading={isUpdatingCase || isTransitioningCase}
          secondaryButtonText={formatMessage(
            strings.cancelCaseModalSecondaryButtonText,
          )}
          onSecondaryButtonClick={handleSecondaryButtonClick}
        >
          <Box marginBottom={8}>
            <CourtCaseNumberInput
              workingCase={caseToCancel}
              setWorkingCase={setCaseToCancel as Dispatch<SetStateAction<Case>>}
            />
          </Box>
        </Modal>
      )}
    </section>
  )
}

export default CasesInProgressTable
