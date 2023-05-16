import { usePermission } from '../PermissionContext'
import { FormCard } from '../../../shared/components/FormCard'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { Input } from '@island.is/island-ui/core'
import React, { useRef } from 'react'
import { useCopyToClipboard } from '../../../shared/hooks/useCopyToClipboard'

export const PermissionBasicInfo = () => {
  const { formatMessage } = useLocale()
  const { copyToClipboard } = useCopyToClipboard()
  const { selectedPermission } = usePermission()
  const permissionIdRef = useRef<HTMLInputElement>(null)

  return (
    <FormCard title={formatMessage(m.basicInfo)}>
      <Input
        ref={permissionIdRef}
        readOnly
        type="text"
        size="sm"
        name="permissionId"
        value={selectedPermission.name}
        label={formatMessage(m.permissionId)}
        buttons={[
          {
            name: 'copy',
            label: 'copy',
            type: 'outline',
            onClick: () => copyToClipboard(permissionIdRef),
          },
        ]}
      />
    </FormCard>
  )
}
