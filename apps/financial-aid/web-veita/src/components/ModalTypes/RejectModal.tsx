import React, { useState } from 'react'

import { InputModal } from '@island.is/financial-aid-web/veita/src/components'
import { Input, Text, Box } from '@island.is/island-ui/core'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (comment?: string) => void
}

const RejectModal = ({ onCancel, onSaveApplication }: Props) => {
  const [comment, setComment] = useState<string>()
  const [linkToRules, setLink] = useState<string>()

  return (
    <InputModal
      headline="Umsókn þinni um aðstoð hefur verið synjað"
      onCancel={onCancel}
      onSubmit={() => {
        if (linkToRules) {
          onSaveApplication(comment + linkToRules)
          return
        }
        onSaveApplication(comment)
      }}
      submitButtonText="Synja og senda á umsækjanda"
    >
      <Box marginBottom={5}>
        <Input
          label="Ástæða synjunar"
          name="reasonForRejection"
          placeholder="Umsókn þinni um fjárhagsaðstoð hefur verið synjað …"
          rows={4}
          value={comment}
          textarea
          backgroundColor="blue"
          onChange={(event) => {
            setComment(event.target.value)
          }}
        />
      </Box>

      <Text variant="h3" marginBottom={2}>
        Smelltu á hlekkinn hér fyrir neðan til að kynna þér reglur um
        fjárhagsaðstoð.
      </Text>

      <Box marginBottom={2}>
        <Input
          label="Hlekkur á reglur fjárhagsaðstoðar Hafnarfjarðar"
          name="Test5"
          placeholder="https://www.dæmi-um-vefslóð.is"
          backgroundColor="blue"
          onChange={(event) => {
            setLink(`<br/> ${event.target.value}`)
          }}
        />
      </Box>

      <Text variant="small" marginBottom={10}>
        Afritaðu og límdu hlekk á reglur um fjárhagsaðstoð hjá því sveitarfélagi
        sem umsækjandi er að sækja um fjárhagsaðstoð hjá. Þessi hlekkur verður
        aðgengilegur umsækjanda á stöðusíðu umsóknarinnar.
      </Text>
    </InputModal>
  )
}

export default RejectModal
