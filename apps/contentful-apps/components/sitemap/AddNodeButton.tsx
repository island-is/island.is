import { Button, Menu } from '@contentful/f36-components'
import { ChevronDownIcon, PlusIcon } from '@contentful/f36-icons'
import { TreeNodeType } from './utils'

interface AddNodeButtonProps {
  addNode: (type: TreeNodeType) => void
}

export const AddNodeButton = ({ addNode }: AddNodeButtonProps) => {
  return (
    <Menu>
      <Menu.Trigger>
        <Button startIcon={<PlusIcon />} endIcon={<ChevronDownIcon />}>
          Add
        </Button>
      </Menu.Trigger>
      <Menu.List>
        <Menu.Item
          onClick={async () => {
            addNode(TreeNodeType.CATEGORY)
          }}
        >
          Category
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            addNode(TreeNodeType.ENTRY)
          }}
        >
          Page
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            addNode(TreeNodeType.URL)
          }}
        >
          URL
        </Menu.Item>
      </Menu.List>
    </Menu>
  )
}
