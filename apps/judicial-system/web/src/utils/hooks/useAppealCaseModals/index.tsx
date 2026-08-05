import { useState } from 'react'
import router from 'next/router'

import { Modal } from '@island.is/judicial-system-web/src/components'

interface UseAppealCaseModalsOptions {
  /** Full route to navigate to when the user confirms an after-deadline appeal. */
  confirmAppealRoute?: string
  /** Full route to navigate to when the user confirms an after-deadline statement. */
  confirmStatementRoute?: string
}

type AppealCaseModal =
  | 'ConfirmAppealAfterDeadline'
  | 'ConfirmStatementAfterDeadline'
  | 'AppealReceived'

/**
 * Owns the small confirmation modals that surround the appeal flow. The
 * navigation targets are passed in by the caller so the same modals can be
 * reused for case-level appeals (route ${APPEAL_ROUTE}/${caseId}) and for
 * ruling-order appeals (same route + a rulingFileId query param).
 */
const useAppealCaseModals = (options: UseAppealCaseModalsOptions = {}) => {
  const [visible, setVisible] = useState<AppealCaseModal | undefined>()

  const close = () => setVisible(undefined)

  const appealCaseModals = (
    <>
      {visible === 'ConfirmAppealAfterDeadline' && (
        <Modal
          title="Kærufrestur er liðinn"
          text="Viltu halda áfram og senda kæru?"
          primaryButton={{
            text: 'Já, senda kæru',
            onClick: () => {
              if (options.confirmAppealRoute) {
                router.push(options.confirmAppealRoute)
              }
            },
          }}
          secondaryButton={{ text: 'Hætta við', onClick: close }}
        />
      )}
      {visible === 'ConfirmStatementAfterDeadline' && (
        <Modal
          title="Frestur til að skila greinargerð er liðinn"
          text="Viltu halda áfram og senda greinargerð?"
          primaryButton={{
            text: 'Já, senda greinargerð',
            onClick: () => {
              if (options.confirmStatementRoute) {
                router.push(options.confirmStatementRoute)
              }
            },
          }}
          secondaryButton={{ text: 'Hætta við', onClick: close }}
        />
      )}
      {visible === 'AppealReceived' && (
        <Modal
          title="Tilkynningar sendar á málsaðila"
          text="Kæra hefur borist Landsrétti. Aðilar máls hafa fengið tilkynningu um frest til að skila greinargerð."
          primaryButton={{ text: 'Loka glugga', onClick: close }}
        />
      )}
    </>
  )

  return {
    appealCaseModals,
    openConfirmAppealAfterDeadline: () =>
      setVisible('ConfirmAppealAfterDeadline'),
    openConfirmStatementAfterDeadline: () =>
      setVisible('ConfirmStatementAfterDeadline'),
    openAppealReceived: () => setVisible('AppealReceived'),
    closeAppealCaseModal: close,
  }
}

export default useAppealCaseModals
