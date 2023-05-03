import { Modal } from '../../Modal/Modal'
import {
  Box,
  Button,
  Checkbox,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { ShadowBox } from '../../ShadowBox/ShadowBox'
import { mockDataUnused, Permission } from '../../Client/MockPermission'

interface AddPermissionsProps {
  isVisible: boolean

  onClose(): void

  handleAddPermission(newPermissions: Permission[]): void

  handleRemovedPermissions(removedPermissions: Permission): void
}

function AddPermissions({
  isVisible,
  onClose,
  handleAddPermission,
}: AddPermissionsProps) {
  const { formatMessage } = useLocale()
  const [selected, setSelected] = React.useState<Map<string, Permission>>(
    new Map(),
  )

  const handleAdd = () => {
    handleAddPermission(Array.from(selected.values()))
    // Close the modal
    onClose()
  }

  const onChange = (value: Permission) => {
    if (selected.has(value.id)) {
      selected.delete(value.id)
    } else {
      selected.set(value.id, value)
    }
    setSelected(new Map(selected))
  }

  return (
    <Modal
      title={formatMessage(m.permissionsModalTitle)}
      id="add-permissions"
      isVisible={isVisible}
      onClose={onClose}
    >
      <Box marginTop={1} marginBottom={4}>
        <Text>{formatMessage(m.permissionsModalDescription)}</Text>
      </Box>
      <ShadowBox isDisabled={!isVisible} flexShrink={1} overflow="auto">
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{/* For matching column count */}</T.HeadData>
              <T.HeadData>
                {formatMessage(m.permissionsTableLabelName)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(m.permissionsTableLabelDescription)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(m.permissionsTableLabelAPI)}
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {mockDataUnused.map((item) => (
              <T.Row key={item.id}>
                <T.Data>
                  <Checkbox
                    onChange={() => {
                      onChange(item)
                    }}
                    value={item.id}
                  />
                </T.Data>
                <T.Data>
                  <Text variant="eyebrow">{item.label}</Text>
                  {item.id}
                </T.Data>
                <T.Data>{item.description}</T.Data>
                <T.Data>{item.api}</T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      </ShadowBox>
      <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
        <Button onClick={onClose} variant="ghost">
          {formatMessage(m.cancel)}
        </Button>
        <Button onClick={handleAdd}>{formatMessage(m.add)}</Button>
      </Box>
    </Modal>
  )
}

export default AddPermissions
