import { useState } from 'react'

import { AccordionCard, ActionCard, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { RotateSecret } from './RotateSecret/RotateSecret'
import { DeleteClient } from './DeleteClient/DeleteClient'
import { useClient } from '../ClientContext'

export const DangerZone = () => {
  const { formatMessage } = useLocale()
  const [isRotateSecretVisible, setRotateSecretVisibility] = useState(false)
  const [isDeleteClientVisible, setDeleteClientVisibility] = useState(false)
  const [deleteOnAllEnvironments, setDeleteOnAllEnvironments] = useState(false)
  const {
    selectedEnvironment: { environment },
  } = useClient()

  const openDeleteModal = (allEnvironments: boolean) => {
    setDeleteOnAllEnvironments(allEnvironments)
    setDeleteClientVisibility(true)
  }

  return (
    <>
      <AccordionCard
        id="danger-zone"
        label={formatMessage(m.dangerZone)}
        labelColor="red600"
        colorVariant="red"
      >
        <Stack space={3}>
          <ActionCard
            heading={formatMessage(m.deleteClient, {
              environment: environment,
            })}
            headingVariant="h4"
            text={formatMessage(m.deleteClientDescription)}
            backgroundColor="red"
            cta={{
              label: formatMessage(m.delete),
              buttonType: {
                variant: 'primary',
                colorScheme: 'destructive',
              },
              icon: undefined,
              onClick: () => openDeleteModal(false),
            }}
          />
          <ActionCard
            heading={formatMessage(m.deleteClientAllEnv, {
              environment: environment,
            })}
            headingVariant="h4"
            text={formatMessage(m.deleteClientDescription)}
            backgroundColor="red"
            cta={{
              label: formatMessage(m.delete),
              buttonType: {
                variant: 'primary',
                colorScheme: 'destructive',
              },
              icon: undefined,
              onClick: () => openDeleteModal(true),
            }}
          />
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
        </Stack>
      </AccordionCard>
      <RotateSecret
        isVisible={isRotateSecretVisible}
        onClose={() => setRotateSecretVisibility(false)}
      />
      <DeleteClient
        isVisible={isDeleteClientVisible}
        onClose={() => setDeleteClientVisibility(false)}
        deleteOnAllEnvironments={deleteOnAllEnvironments}
      />
    </>
  )
}
