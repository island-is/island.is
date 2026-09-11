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
  // Called with the defendants whose decision was saved, whether or not every
  // save succeeded, so the page can stop counting them as changed and a retry
  // sends only what failed.
  onSaved: (savedDefendantIds: string[]) => void
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
  const { caseId, changedDefendants, onClose, onSaved, onConfirmed } = props
  const { formatMessage: fm } = useIntl()
  const { updateDefendant, isUpdatingDefendant } = useDefendants()

  // The saves are independent requests, not one transaction: some may succeed
  // while another fails. Those that did are reported back so they are not sent
  // again; the modal stays open for the rest.
  const handleConfirm = async () => {
    const results = await Promise.all(
      changedDefendants.map(async (defendant) => ({
        defendant,
        saved: Boolean(
          await updateDefendant({
            caseId,
            defendantId: defendant.id,
            indictmentReviewDecision: defendant.indictmentReviewDecision,
          }),
        ),
      })),
    )

    const savedDefendantIds = results
      .filter(({ saved }) => saved)
      .map(({ defendant }) => defendant.id)

    if (savedDefendantIds.length > 0) {
      onSaved(savedDefendantIds)
    }

    if (savedDefendantIds.length < changedDefendants.length) {
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
