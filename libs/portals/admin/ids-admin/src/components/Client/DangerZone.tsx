import { useNavigate, useParams } from 'react-router-dom'

import { AccordionCard, ActionCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { replaceParams } from '@island.is/react-spa/shared'

import { m } from '../../lib/messages'
import { IDSAdminPaths } from '../../lib/paths'

export const DangerZone = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { tenant, client } = useParams()

  const openRotateSecretModal = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClientRotateSecret,
        params: { tenant, client },
      }),
    )
  }

  return (
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
          onClick: openRotateSecretModal,
        }}
      />
    </AccordionCard>
  )
}
