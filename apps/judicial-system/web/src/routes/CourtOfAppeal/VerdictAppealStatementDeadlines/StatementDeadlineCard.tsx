import type { FC } from 'react'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { DateTime, Modal } from '@island.is/judicial-system-web/src/components'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import type { StatementDeadlineParty } from './VerdictAppealStatementDeadlines.logic'
import {
  canSendStatementDeadline,
  getStatementDeadlineActionLabel,
  getStatementDeadlineConfirmation,
  getStatementDeadlineMinDate,
  getStatementDeadlineStatusLabel,
} from './VerdictAppealStatementDeadlines.logic'
import * as styles from './StatementDeadlineCard.css'

interface Props {
  party: StatementDeadlineParty
  // Sends the picked deadline for the party. Resolves true once it is saved.
  onSend: (party: StatementDeadlineParty, deadline: Date) => Promise<boolean>
  isSending: boolean
}

/**
 * One party's deadline: who they are and where their statement stands, the
 * date the court gives them, and the action that sends it.
 *
 * The date is a draft until sent. A party whose statement is in has nothing
 * left to be given, so its date is shown locked and the action is gone.
 */
const StatementDeadlineCard: FC<Props> = ({ party, onSend, isSending }) => {
  const [pickedDate, setPickedDate] = useState<Date>()
  const [isConfirming, setIsConfirming] = useState(false)

  const canSend = canSendStatementDeadline(party, pickedDate)
  const confirmation = pickedDate
    ? getStatementDeadlineConfirmation(party, pickedDate)
    : undefined

  const send = async () => {
    if (!pickedDate) {
      return
    }

    const sent = await onSend(party, pickedDate)

    if (sent) {
      setPickedDate(undefined)
      setIsConfirming(false)
    }
  }

  return (
    <Box
      component="section"
      aria-label={party.name || party.roleLabel}
      background="white"
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      padding={3}
      className={styles.card}
    >
      <Box>
        {/* The role line is plain until the statement is in, and then it is
            the green, weighted line the design uses to pick those out. */}
        <Text
          variant="small"
          fontWeight={party.hasFiledStatement ? 'semiBold' : 'regular'}
          color={party.hasFiledStatement ? 'mint800' : 'dark400'}
        >
          {getStatementDeadlineStatusLabel(party)}
        </Text>
        <Text variant="h4">{party.name}</Text>
      </Box>
      <DateTime
        name={`statement-deadline-${party.key}`}
        datepickerLabel="Frestur til"
        datepickerPlaceholder="Veldu dagsetningu"
        selectedDate={pickedDate ?? party.deadline}
        minDate={getStatementDeadlineMinDate(party)}
        blueBox={false}
        size="sm"
        dateOnly
        disabled={party.hasFiledStatement}
        onChange={(date) => setPickedDate(date)}
      />
      {!party.hasFiledStatement && (
        <div className={styles.action}>
          <Button
            variant="text"
            size="small"
            icon="arrowForward"
            disabled={!canSend}
            onClick={() => setIsConfirming(true)}
          >
            {getStatementDeadlineActionLabel(party)}
          </Button>
        </div>
      )}
      <AnimatePresence>
        {/* No close handler on purpose: the dialog is left through its own
            buttons, with no corner cross, and so no Escape or backdrop close
            either. The body goes in as children rather than text, because
            the text slot sets a fixed margin above the buttons and the design
            has a wider one: 80px from the text to the buttons, of which the
            footer's own padding gives 16. */}
        {isConfirming && confirmation && (
          <Modal
            title={confirmation.title}
            buttons={[
              {
                text: 'Hætta við',
                onClick: () => setIsConfirming(false),
                variant: 'ghost',
              },
              {
                text: 'Já, senda',
                onClick: send,
                isLoading: isSending,
                dataTestId: 'confirmStatementDeadlineButton',
              },
            ]}
          >
            <Box marginBottom={8} className={stack({ gap: 2 })}>
              <Text>{confirmation.intro}</Text>
              <div>
                {confirmation.details.map((line) => (
                  <Text key={line}>{line}</Text>
                ))}
              </div>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default StatementDeadlineCard
