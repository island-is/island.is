import React, { FC, useState } from 'react'
import { Modal } from '@island.is/service-portal/core'
import { Text, Button, Box, Columns, Column } from '@island.is/island-ui/core'

interface Props {
  onClose: () => void
  close?: boolean
  type: 'tel' | 'mail' | 'all'
}

export const DropModal: FC<Props> = ({ onClose, close, type }) => {
  const [closeModal, setCloseModal] = useState(close)
  const anyStrings = {
    title: 'Ertu alveg viss um að þú viljir ekki skrá netfang og/eða síma?',
    text: `Ertu viss um þú viljir halda áfram án þess að skrá símanúmer eða
      netfang? Við komum til með að senda á þig staðfestingar og tilkynningar
      og því er gott að vera með rétt númer og netfang skráð`,
  }
  const emailStrings = {
    title: 'Ertu alveg viss um að þú viljir ekki skrá netfang?',
    text: `Ertu viss um þú viljir halda áfram án þess að skrá
      netfang? Við komum til með að senda á þig staðfestingar og tilkynningar
      og því er gott að vera með rétt netfang skráð`,
  }
  const telStrings = {
    title: 'Ertu alveg viss um að þú viljir ekki skrá síma?',
    text: `Ertu viss um þú viljir halda áfram án þess að skrá
      síma? Við komum til með að senda á þig staðfestingar og tilkynningar
      og því er gott að vera með rétt símanúmer skráð`,
  }
  return (
    <Modal id="drop-onboarding-modal" toggleClose={closeModal}>
      <Text variant="h4" as="h2" marginBottom={1}>
        {type === 'tel' && telStrings.title}
        {type === 'mail' && emailStrings.title}
        {type === 'all' && anyStrings.title}
      </Text>
      <Text>
        {type === 'tel' && telStrings.text}
        {type === 'mail' && emailStrings.text}
        {type === 'all' && anyStrings.text}
      </Text>
      <Box marginTop={4}>
        <Columns>
          <Column width="content">
            <Box
              display="flex"
              alignItems="flexEnd"
              flexDirection="column"
              marginRight={2}
            >
              <Button onClick={() => setCloseModal(true)} size="small">
                Ég vil skrá upplýsingar
              </Button>
            </Box>
          </Column>
          <Column width="content">
            <Box display="flex" alignItems="flexEnd" flexDirection="column">
              <Button onClick={onClose} variant="ghost" size="small">
                Ég vil halda áfram
              </Button>
            </Box>
          </Column>
        </Columns>
      </Box>
    </Modal>
  )
}
