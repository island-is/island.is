import { FC, useContext } from 'react'

import { Box } from '@island.is/island-ui/core'
import {
  APPEAL_FILES_ROUTE,
  APPEAL_ROUTE,
  DEFENDER_APPEAL_FILES_ROUTE,
  DEFENDER_APPEAL_ROUTE,
  DEFENDER_STATEMENT_ROUTE,
  STATEMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isDefenceUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  ContextMenu,
  FormContext,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useWithdrawAppeal } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenuItems/WithdrawAppeal'
import IconButton from '@island.is/judicial-system-web/src/components/IconButton/IconButton'
import {
  AppealCaseState,
  AppealCaseTransition,
  CaseFile,
  CaseFileCategory,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useAppealCase,
  useAppealCaseModals,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { ContextMenuItem } from '../ContextMenu/ContextMenu'

interface Props {
  file: CaseFile
  onOpenFile: (fileId: string) => void
}

/**
 * Single ruling-order (`COURT_INDICTMENT_RULING_ORDER`) file row with an
 * action context menu attached. The available menu items are role- and
 * appeal-state-driven.
 *
 * Rendered in place of the plain `<RenderFiles>` row when the
 * `Feature.APPEAL_RULING_ORDER` flag is on.
 */
const RulingOrderFileRow: FC<Props> = ({ file, onOpenFile }) => {
  const { user } = useContext(UserContext)
  const { workingCase, refreshCase } = useContext(FormContext)

  const isProsecution = isProsecutionUser(user)
  const isDefence = isDefenceUser(user)
  const isDistrictCourt = isDistrictCourtUser(user)

  const appealCase = workingCase.rulingOrderAppealCases?.find(
    (a) => a.rulingFileId === file.id,
  )

  // Per-rulingFileId routes — reuse existing case-level routes and pass the
  // ruling file id as a query param. Step 6e wires the menu; the route
  // components themselves will be taught to honour the param later.
  const appealRoute = isDefence ? DEFENDER_APPEAL_ROUTE : APPEAL_ROUTE
  const statementRoute = isDefence ? DEFENDER_STATEMENT_ROUTE : STATEMENT_ROUTE
  const appealFilesRoute = isDefence
    ? DEFENDER_APPEAL_FILES_ROUTE
    : APPEAL_FILES_ROUTE
  const appealHref = `${appealRoute}/${workingCase.id}?rulingFileId=${file.id}`
  const statementHref = `${statementRoute}/${workingCase.id}?rulingFileId=${file.id}`
  const filesHref = `${appealFilesRoute}/${workingCase.id}?rulingFileId=${file.id}`

  const {
    appealCaseModals,
    openConfirmAppealAfterDeadline,
    openConfirmStatementAfterDeadline,
    openAppealReceived,
  } = useAppealCaseModals({
    confirmAppealRoute: appealHref,
    confirmStatementRoute: statementHref,
  })

  const { withdrawAppeal, WithdrawAppealModal } = useWithdrawAppeal(() => {
    refreshCase()
  })

  const { transitionAppealCase } = useAppealCase()

  const handleSendToCourtOfAppeals = async () => {
    if (!appealCase) {
      return
    }
    const success = await transitionAppealCase(
      workingCase.id,
      appealCase.id,
      AppealCaseTransition.RECEIVE_APPEAL,
    )
    if (!success) {
      return
    }
    openAppealReceived()
    refreshCase()
  }

  // Has the current user already submitted an appeal statement for this
  // ruling-order appeal? Determined by category + rulingFileId match against
  // the appeal-related case files. Prosecution-side: any prosecutor's
  // statement counts. Defence-side: a single submission per side is also the
  // current convention; refine if needed once multi-defender stories land.
  const userStatementCategory = isProsecution
    ? CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT
    : isDefence
    ? CaseFileCategory.DEFENDANT_APPEAL_STATEMENT
    : undefined
  const hasSentStatement =
    userStatementCategory !== undefined &&
    Boolean(
      workingCase.caseFiles?.some(
        (f) =>
          f.rulingFileId === file.id && f.category === userStatementCategory,
      ),
    )

  const isAppellant =
    Boolean(appealCase) &&
    ((appealCase?.appealedByRole === UserRole.PROSECUTOR && isProsecution) ||
      (appealCase?.appealedByRole === UserRole.DEFENDER &&
        isDefence &&
        Boolean(user?.nationalId) &&
        user?.nationalId === appealCase?.appealedByNationalId))

  const items: ContextMenuItem[] = []

  if (!appealCase) {
    if (file.canBeAppealed && (isProsecution || isDefence)) {
      items.push({
        title: 'Senda inn kæru',
        icon: 'document',
        ...(file.isAppealDeadlineExpired
          ? { onClick: openConfirmAppealAfterDeadline }
          : { href: appealHref }),
      })
    }
  } else if (
    appealCase.appealState === AppealCaseState.APPEALED ||
    appealCase.appealState === AppealCaseState.RECEIVED
  ) {
    if (isProsecution || isDefence) {
      if (!hasSentStatement) {
        items.push({
          title: 'Senda inn greinargerð',
          icon: 'document',
          ...(appealCase.isStatementDeadlineExpired
            ? { onClick: openConfirmStatementAfterDeadline }
            : { href: statementHref }),
        })
      }
      items.push({
        title: 'Bæta við gögnum',
        icon: 'add',
        href: filesHref,
      })
      if (isAppellant) {
        items.push(withdrawAppeal(workingCase.id, appealCase.id))
      }
    } else if (
      isDistrictCourt &&
      appealCase.appealState === AppealCaseState.APPEALED
    ) {
      items.push({
        title: 'Senda til Landsréttar',
        icon: 'document',
        onClick: handleSendToCourtOfAppeals,
      })
    }
  }
  // COMPLETED / WITHDRAWN: read-only, no menu items.

  const fileName = file.userGeneratedFilename ?? file.name ?? ''

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1}>
        <PdfButton
          title={fileName}
          renderAs="row"
          disabled={!file.isKeyAccessible}
          handleClick={() => onOpenFile(file.id)}
        >
          {items.length > 0 && (
            <Box marginLeft={1}>
              <ContextMenu
                items={items}
                placement="left-start"
                shift={-12}
                render={
                  <IconButton
                    icon="ellipsisVertical"
                    colorScheme="transparent"
                    onClick={(evt) => {
                      evt.stopPropagation()
                    }}
                  />
                }
              />
            </Box>
          )}
        </PdfButton>
      </Box>
      {appealCaseModals}
      {WithdrawAppealModal}
    </Box>
  )
}

export default RulingOrderFileRow
