import { IconButton, Menu } from '@contentful/f36-components'
import { MoreVerticalIcon } from '@contentful/f36-icons'

interface EditMenuProps {
  onEdit: () => void
  onRemove: () => void
}

export const EditMenu = ({ onEdit, onRemove }: EditMenuProps) => {
  return (
    <Menu>
      <Menu.Trigger>
        <IconButton icon={<MoreVerticalIcon />} aria-label="Edit" />
      </Menu.Trigger>
      <Menu.List>
        <Menu.Item onClick={onEdit}>Edit</Menu.Item>
        <Menu.Item onClick={onRemove}>Remove</Menu.Item>
      </Menu.List>
    </Menu>
  )
}
