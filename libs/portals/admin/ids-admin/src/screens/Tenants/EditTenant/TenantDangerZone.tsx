import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AccordionCard, ActionCard, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { IDSAdminPaths } from '../../../lib/paths'
import DeleteTenantModal from '../DeleteTenantModal/DeleteTenantModal'

type TenantDangerZoneProps = {
  tenantId: string
  displayName?: string | null
}

export const TenantDangerZone = ({
  tenantId,
  displayName,
}: TenantDangerZoneProps) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [isDeleteVisible, setDeleteVisible] = useState(false)

  return (
    <>
      <AccordionCard
        id="tenant-danger-zone"
        label={formatMessage(m.dangerZone)}
        labelColor="red600"
        colorVariant="red"
      >
        <Stack space={3}>
          <ActionCard
            heading={formatMessage(m.deleteTenant)}
            headingVariant="h4"
            text={formatMessage(m.deleteTenantDescription)}
            backgroundColor="red"
            cta={{
              label: formatMessage(m.deleteTenant),
              buttonType: {
                variant: 'primary',
                colorScheme: 'destructive',
              },
              icon: undefined,
              onClick: () => setDeleteVisible(true),
            }}
          />
        </Stack>
      </AccordionCard>
      {isDeleteVisible && (
        <DeleteTenantModal
          tenantId={tenantId}
          displayName={displayName}
          onClose={() => setDeleteVisible(false)}
          onDeleted={() => {
            setDeleteVisible(false)
            navigate(IDSAdminPaths.IDSAdmin)
          }}
        />
      )}
    </>
  )
}
