import type { FC } from 'react'
import { useIntl } from 'react-intl'

import { Modal } from '@island.is/judicial-system-web/src/components'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './ReviewDecision.strings'

interface Props {
  caseId: string
  // The defendants whose review decision changed - the only ones saved.
  changedDefendants: Defendant[]
  onClose: () => void
  // Called once every changed decision has been saved.
  onConfirmed: () => void
}

/**
 * Confirms the reviewer's decisions for the whole case and saves the ones that
 * changed. One modal for the page, whatever the number of defendants: the
 * decisions are confirmed together, and the page - not each defendant's radio
 * pair - knows which of them changed.
 */
export const ReviewDecisionModal: FC<Props> = (props) => {
  const { caseId, changedDefendants, onClose, onConfirmed } = props
  const { formatMessage: fm } = useIntl()
  const { updateDefendant, isUpdatingDefendant } = useDefendants()

  const handleConfirm = async () => {
    const results = await Promise.all(
      changedDefendants.map((defendant) =>
        updateDefendant({
          caseId,
          defendantId: defendant.id,
          indictmentReviewDecision: defendant.indictmentReviewDecision,
        }),
      ),
    )

    if (!results.every(Boolean)) {
      return
    }

    onConfirmed()
  }

  return (
    <Modal
      title={fm(strings.reviewModalTitle)}
      text="Ertu viss um að þú viljir ljúka yfirlestri?"
      buttons={[
        {
          text: fm(strings.reviewModalSecondaryButtonText),
          onClick: onClose,
          variant: 'ghost',
        },
        {
          text: fm(strings.reviewModalPrimaryButtonText),
          onClick: handleConfirm,
          isLoading: isUpdatingDefendant,
        },
      ]}
      onClose={onClose}
    />
  )
}
