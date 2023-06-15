import React, { useRef } from 'react'

import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { usePermission } from '../PermissionContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { m } from '../../../lib/messages'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'

export const PermissionBasicInfo = () => {
  const { formatMessage } = useLocale()
  const { copyToClipboard } = useCopyToClipboard()
  const { selectedPermission } = usePermission()
  const permissionIdRef = useRef<HTMLInputElement>(null)

  return (
    <FormCard
      title={formatMessage(m.basicInfo)}
      shouldSupportMultiEnvironment={false}
    >
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
            label: formatMessage(m.copy),
            type: 'outline',
            onClick: () => copyToClipboard(permissionIdRef),
          },
        ]}
      />
    </FormCard>
  )
}
