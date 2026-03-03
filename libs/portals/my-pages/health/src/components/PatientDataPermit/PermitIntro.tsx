import { Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import { messages } from '../../lib/messages'
import { InfoModal } from './DataModal'

export const PermitIntro: React.FC = () => {
  const { formatMessage } = useLocale()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Text variant="default" fontWeight="light">
        {formatMessage(messages.permitDetailIntro, {
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
      <InfoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
