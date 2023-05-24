import { useState } from 'react'

import { AccordionCard, ActionCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { RotateSecret } from './RotateSecret/RotateSecret'

export const DangerZone = () => {
  const { formatMessage } = useLocale()
  const [isRotateSecretVisible, setRotateSecretVisibility] = useState(false)

  return (
    <>
      <AccordionCard
        id="danger-zone"
        label={formatMessage(m.dangerZone)}
        labelColor="red600"
        colorVariant="red"
      >
        <ActionCard
          heading={formatMessage(m.rotateSecret)}
          headingVariant="h4"
          text={formatMessage(m.rotateSecretActionCardLabel)}
          backgroundColor="red"
          cta={{
            label: formatMessage(m.rotate),
            buttonType: {
              variant: 'primary',
              colorScheme: 'destructive',
            },
            icon: undefined,
            onClick: () => setRotateSecretVisibility(true),
          }}
        />
      </AccordionCard>
      <RotateSecret
        isVisible={isRotateSecretVisible}
        onClose={() => setRotateSecretVisibility(false)}
      />
    </>
  )
}
