import { FC, MouseEvent, useContext, useState } from 'react'

import { Box, Button, Icon, Text, toast } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  FormContext,
  Modal,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'

import { useConfirmRulingOrderMutation } from './confirmRulingOrder.generated'

interface Props {
  file: CaseFile
  onOpenFile: (fileId: string) => void
}

/**
 * Single ruling-order (`COURT_INDICTMENT_RULING_ORDER`) file row showing the
 * confirmation state of the ruling uploaded during the course of a case:
 * - confirmed: the "Staðfest - {date} kl. {time}" label with the judge's name
 *   and a checkmark,
 * - the registered judge: a "Staðfesta" button,
 * - other district-court staff: a "Bíður staðfestingar" text.
 */
const RulingOrderConfirmation: FC<Props> = ({ file, onOpenFile }) => {
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
          {isConfirmed ? (
            <Box display="flex" alignItems="center" marginLeft={1}>
              <Box marginRight={2} textAlign="right">
                <Text>{`Staðfest - ${formatDate(
                  file.submissionDate,
                )} kl. ${formatDate(file.submissionDate, 'HH:mm')}`}</Text>
                <Text variant="small">{workingCase.judge?.name}</Text>
              </Box>
              <Icon icon="checkmark" size="large" color="mint600" />
            </Box>
          ) : isRegisteredJudge ? (
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
            </Box>
          ) : (
            <Box marginLeft={1}>
              <Text variant="small" color="dark300">
                Bíður staðfestingar
              </Text>
            </Box>
          )}
        </PdfButton>
      </Box>
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

export default RulingOrderConfirmation
