import { Button, Menu } from '@contentful/f36-components'
import { ChevronDownIcon, PlusIcon } from '@contentful/f36-icons'

import { TreeNodeType } from './utils'

const optionMap = {
  [TreeNodeType.CATEGORY]: 'Category',
  [TreeNodeType.ENTRY]: 'Page',
  [TreeNodeType.URL]: 'URL',
}

interface AddNodeButtonProps {
  addNode: (type: TreeNodeType) => void
  options?: TreeNodeType[]
}

export const AddNodeButton = ({
  addNode,
  options = [TreeNodeType.CATEGORY, TreeNodeType.ENTRY, TreeNodeType.URL],
}: AddNodeButtonProps) => {
  return (
    <Menu>
      <Menu.Trigger>
        <Button startIcon={<PlusIcon />} endIcon={<ChevronDownIcon />}>
          Add
        </Button>
      </Menu.Trigger>
      <Menu.List>
        {options.map((option) => (
          <Menu.Item
            key={option}
            onClick={() => {
              addNode(option)
            }}
          >
            {optionMap[option]}
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  )
}
