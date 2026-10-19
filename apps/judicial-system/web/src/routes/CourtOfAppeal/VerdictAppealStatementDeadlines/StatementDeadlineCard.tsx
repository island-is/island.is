import type { FC } from 'react'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { DateTime, Modal } from '@island.is/judicial-system-web/src/components'

import type { StatementDeadlineParty } from './VerdictAppealStatementDeadlines.logic'
import {
  canSendStatementDeadline,
  getStatementDeadlineActionLabel,
  getStatementDeadlineConfirmation,
  getStatementDeadlineMinDate,
  getStatementDeadlineStatusLabel,
} from './VerdictAppealStatementDeadlines.logic'

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
      display="flex"
      flexDirection={['column', 'column', 'row']}
      justifyContent="spaceBetween"
      columnGap={3}
      rowGap={2}
    >
      <Box>
        <Text
          variant="eyebrow"
          color={party.hasFiledStatement ? 'mint800' : 'dark400'}
        >
          {getStatementDeadlineStatusLabel(party)}
        </Text>
        <Text variant="h4">{party.name}</Text>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flexEnd"
        rowGap={1}
      >
        <DateTime
          name={`statement-deadline-${party.key}`}
          datepickerLabel="Frestur til"
          datepickerPlaceholder="Veldu dagsetningu"
          selectedDate={pickedDate ?? party.deadline}
          minDate={getStatementDeadlineMinDate(party)}
          blueBox={false}
          dateOnly
          disabled={party.hasFiledStatement}
          onChange={(date) => setPickedDate(date)}
        />
        {!party.hasFiledStatement && (
          <Button
            variant="text"
            icon="arrowForward"
            disabled={!canSend}
            onClick={() => setIsConfirming(true)}
          >
            {getStatementDeadlineActionLabel(party)}
          </Button>
        )}
      </Box>
      <AnimatePresence>
        {isConfirming && confirmation && (
          <Modal
            title={confirmation.title}
            text={
              <Box>
                {confirmation.lines.map((line) => (
                  <Text key={line}>{line}</Text>
                ))}
              </Box>
            }
            onClose={() => setIsConfirming(false)}
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
          />
        )}
      </AnimatePresence>
    </Box>
  )
}

export default StatementDeadlineCard
