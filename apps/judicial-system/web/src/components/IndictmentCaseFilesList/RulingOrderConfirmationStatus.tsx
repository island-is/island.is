import { FC, MouseEvent, useContext, useState } from 'react'

import { Box, Button, Icon, Text, toast } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { isDistrictCourtUser } from '@island.is/judicial-system/types'
import {
  FormContext,
  Modal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'

import { useConfirmRulingOrderMutation } from './confirmRulingOrder.generated'

interface Props {
  file: CaseFile
}

/**
 * Right-aligned confirmation state of a ruling order uploaded during the
 * course of a case:
 * - confirmed: the "Staðfest - {date} kl. {time}" label with the judge's name
 *   and a checkmark (visible to everyone who can see the file),
 * - the registered judge: a "Staðfesta" button,
 * - other district-court staff: a "Bíður staðfestingar" text.
 *
 * Rendered as a child of the ruling-order file row, regardless of which row
 * variant (with or without the appeal context menu) is in use.
 */
const RulingOrderConfirmationStatus: FC<Props> = ({ file }) => {
  const { user } = useContext(UserContext)
  const { workingCase, refreshCase } = useContext(FormContext)
  const [modalVisible, setModalVisible] = useState(false)

  const [confirmRulingOrder, { loading }] = useConfirmRulingOrderMutation()

  const isConfirmed = Boolean(file.submissionDate)
  const isRegisteredJudge = Boolean(
    user?.id && user.id === workingCase.judge?.id,
  )

  const handleConfirm = async () => {
    try {
      const { data, errors } = await confirmRulingOrder({
        variables: { input: { id: file.id, caseId: workingCase.id } },
      })

      if (errors || !data?.confirmRulingOrder) {
        throw new Error('Failed to confirm ruling order')
      }

      setModalVisible(false)
      refreshCase()
    } catch {
      toast.error('Upp kom villa við að staðfesta úrskurð.')
    }
  }

  if (isConfirmed) {
    return (
      <Box display="flex" alignItems="center" marginLeft={1}>
        <Box marginRight={2} textAlign="right">
          <Text whiteSpace="nowrap">{`Staðfest - ${formatDate(
            file.submissionDate,
          )} kl. ${formatDate(file.submissionDate, 'HH:mm')}`}</Text>
          <Text variant="small">{workingCase.judge?.name}</Text>
        </Box>
        <Icon icon="checkmark" size="large" color="mint600" />
      </Box>
    )
  }

  if (isRegisteredJudge) {
    return (
      <Box marginLeft={1}>
        <Button
          variant="ghost"
          size="small"
          loading={loading}
          onClick={(evt: MouseEvent) => {
            evt.stopPropagation()
            setModalVisible(true)
          }}
        >
          Staðfesta
        </Button>
        {modalVisible && (
          <Modal
            title="Viltu staðfesta úrskurð?"
            primaryButton={{
              text: 'Staðfesta',
              onClick: handleConfirm,
              isLoading: loading,
            }}
            secondaryButton={{
              text: 'Hætta við',
              onClick: () => setModalVisible(false),
            }}
            onClose={() => setModalVisible(false)}
          />
        )}
      </Box>
    )
  }

  if (isDistrictCourtUser(user)) {
    return (
      <Box marginLeft={1}>
        <Text variant="small" color="dark300">
          Bíður staðfestingar
        </Text>
      </Box>
    )
  }

  return null
}

export default RulingOrderConfirmationStatus
