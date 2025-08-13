import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import { messages } from '../../lib/messages'
import { InfoModal } from './DataModal'
import * as styles from './PatientDataPermit.css'

interface FirstStepProps {
  onClick?: () => void
}

const FirstStep: React.FC<FirstStepProps> = ({ onClick }) => {
  const { formatMessage } = useLocale()

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [accepted, setAccepted] = useState<boolean>(false)
  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: '1', second: '3' })}
      </Text>
      <Text variant="h5" marginTop={1} marginBottom={2}>
        {formatMessage(messages.chooseDataToShare)}
      </Text>
      <Box className={styles.linkText} marginBottom={2}>
        <Text variant="default" fontWeight="light">
          {formatMessage(messages.permitApprovalDescription, {
            link: (str: any) => (
              <Button
                variant="text"
                size="medium"
                onClick={() => setModalOpen(true)}
              >
                {str}
              </Button>
            ),
          })}
        </Text>
      </Box>
      <Box>
        <Checkbox
          backgroundColor="blue"
          checked={accepted}
          onChange={() => setAccepted(!accepted)}
          large
          label={formatMessage(messages.permitApproval)}
        ></Checkbox>
      </Box>
      <Box display="flex" justifyContent="flexEnd" marginTop={3}>
        <Box className={styles.forwardButton}>
          <Button fluid size="small" disabled={!accepted} onClick={onClick}>
            {formatMessage(messages.forward)}
          </Button>
        </Box>
      </Box>
      <InfoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  )
}

export default FirstStep
