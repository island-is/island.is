import { Button, Menu } from '@contentful/f36-components'
import { ChevronDownIcon, PlusIcon } from '@contentful/f36-icons'

import { TreeNodeType } from './utils'

const optionMap = {
  [TreeNodeType.CATEGORY]: 'Category',
  [TreeNodeType.ENTRY]: 'Page',
  [TreeNodeType.URL]: 'URL',
}

interface AddNodeButtonProps {
  addNode: (type: TreeNodeType, createNew?: boolean) => void
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
        {options.map((option) => {
          if (option !== TreeNodeType.ENTRY) {
            return (
              <Menu.Item
                key={option}
                onClick={() => {
                  addNode(option)
                }}
              >
                {optionMap[option]}
              </Menu.Item>
            )
          }
          return (
            <Menu.Submenu key={option}>
              <Menu.SubmenuTrigger>Page</Menu.SubmenuTrigger>
              <Menu.List>
                <Menu.Item
                  onClick={() => {
                    addNode(option, true)
                  }}
                >
                  Create new
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    addNode(option, false)
                  }}
                >
                  Add existing
                </Menu.Item>
              </Menu.List>
            </Menu.Submenu>
          )
        })}
      </Menu.List>
    </Menu>
  )
}
