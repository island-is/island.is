import type { FC } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Modal } from '@island.is/judicial-system-web/src/components'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import {
  getReviewDecisionLabel,
  isLateVerdictAppeal,
} from './ReviewDecision.logic'
import { strings } from './ReviewDecision.strings'

interface Props {
  caseId: string
  // The defendants whose review decision changed - the only ones saved.
  changedDefendants: Defendant[]
  isFine: boolean
  // The prosecution's own deadline to appeal. Passing it late is allowed, and
  // only changes what the confirmation says.
  indictmentAppealDeadline?: string | null
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
 *
 * For the public prosecution the decision is the appeal, but filing it is not
 * done from here: the backend files and withdraws the verdict appeal in the
 * same transaction as the decision, so the two cannot drift apart.
 */
export const ReviewDecisionModal: FC<Props> = (props) => {
  const {
    caseId,
    changedDefendants,
    isFine,
    indictmentAppealDeadline,
    onClose,
    onSaved,
    onConfirmed,
  } = props
  const { formatMessage: fm } = useIntl()
  const { updateDefendant, isUpdatingDefendant } = useDefendants()

  const isLate = isLateVerdictAppeal(
    changedDefendants,
    indictmentAppealDeadline,
  )

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
      title={
        isLate ? 'Áfrýjun eftir að fresti lauk' : fm(strings.reviewModalTitle)
      }
      text={
        <div className={stack({ gap: 2 })}>
          {isLate && (
            <Text>
              {`Áfrýjunarfrestur rann út ${formatDate(
                indictmentAppealDeadline,
              )}.`}
            </Text>
          )}
          <Text>Viltu staðfesta eftirfarandi ákvörðun:</Text>
          {/* The decisions are one list, so they sit together rather than
          spaced apart the way the paragraphs above them are. */}
          <div>
            {changedDefendants.map((defendant) => (
              <Text key={defendant.id}>
                <strong>{`${defendant.name}: `}</strong>
                {getReviewDecisionLabel(
                  defendant.indictmentReviewDecision,
                  isFine,
                )}
              </Text>
            ))}
          </div>
        </div>
      }
      buttons={[
        {
          text: 'Til baka',
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
