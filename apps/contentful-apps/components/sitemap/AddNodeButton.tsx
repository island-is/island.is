import { Button, Menu } from '@contentful/f36-components'
import { ChevronDownIcon, PlusIcon } from '@contentful/f36-icons'

import { type EntryType, optionMap, TreeNodeType } from './utils'

interface AddNodeButtonProps {
  addNode: (
    type: TreeNodeType,
    createNew?: boolean,
    entryType?: EntryType,
  ) => void
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
                    addNode(option, true, 'organizationParentSubpage')
                  }}
                >
                  Create new organization parent subpage
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    addNode(option, true, 'organizationSubpage')
                  }}
                >
                  Create new organization subpage
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
