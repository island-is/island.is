import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import { messages } from '../../lib/messages'
import { InfoModal } from './DataModal'
import * as styles from './PatientDataPermit.css'

interface TermsProps {
  onClick?: () => void
  goBack?: () => void
  loading?: boolean
}

// Permit approval step
const Terms: React.FC<TermsProps> = ({ onClick, goBack, loading }) => {
  const { formatMessage } = useLocale()

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [accepted, setAccepted] = useState<boolean>(false)
  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: '3', second: '3' })}
      </Text>
      <Text variant="h5" marginTop={1} marginBottom={2}>
        {formatMessage(messages.chooseDataToShare)}
      </Text>
      <Box className={styles.linkText} marginBottom={2}>
        <Text variant="default" fontWeight="light">
          {formatMessage(messages.permitApprovalDescription, {
            link: (parts: React.ReactNode[]) => (
              <Button
                variant="text"
                size="medium"
                onClick={() => setModalOpen(true)}
              >
                {parts}
              </Button>
            ),
          })}
        </Text>
      </Box>
      <Checkbox
        backgroundColor="blue"
        checked={accepted}
        onChange={() => {
          console.log('checkbox')
          setAccepted(!accepted)
        }}
        large
        label={formatMessage(messages.permitApproval)}
      />
      <Box
        display="flex"
        justifyContent="spaceBetween"
        marginTop={4}
        flexWrap="nowrap"
        columnGap={2}
      >
        <Box className={styles.forwardButton} marginBottom={[1, 1, 0]}>
          <Button
            fluid
            variant="ghost"
            size="small"
            onClick={goBack}
            preTextIcon="arrowBack"
          >
            {formatMessage(messages.goBack)}
          </Button>
        </Box>
        <Box className={styles.forwardButton}>
          <Button
            fluid
            size="small"
            disabled={!accepted || loading}
            onClick={() => {
              onClick && onClick()
            }}
          >
            {formatMessage(messages.forward)}
          </Button>
        </Box>
      </Box>
      <InfoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  )
}

export default Terms
