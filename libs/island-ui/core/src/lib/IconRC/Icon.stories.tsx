import { theme } from '@island.is/island-ui/theme'
import React, { useState } from 'react'
import { Input } from '../Input/Input'
import { Box } from '../Box/Box'
import { Tabs } from '../Tabs/Tabs'
import iconMap from './iconMap'
import { Icon, IconPropsType } from './Icon'

export default {
  title: 'Core/Icon',
  component: Icon,
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: Object.keys(theme.color),
      },
    },
  },
}

const Template = (args) => <Icon {...args} />

export const Default = Template.bind({})
Default.args = { icon: 'download' }

const iconKeys = Object.keys(iconMap) as IconPropsType['type'][]

const getTabs = (search) =>
  iconKeys.map((typeKey) => {
    const iconKeys = Object.keys(iconMap[typeKey]) as IconPropsType['icon'][]
    return {
      label: typeKey,
      content: (
        <Box padding={2}>
          {iconKeys.reduce((acc, iconKey) => {
            if (
              iconKey.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
              search === ''
            ) {
              acc = [
                ...acc,
                <Box padding={2} display="inlineBlock">
                  <Icon title={iconKey} type={typeKey} icon={iconKey} />
                </Box>,
              ]
            }
            return acc
          }, [])}
        </Box>
      ),
    }
  })

export const AllIcons = () => {
  const [search, setSearch] = useState('')

  // TODO: maybe memorize and debounce for better performance
  const tabs = getTabs(search)
  return (
    <>
      <Box marginBottom={4}>
        <Input
          label="search"
          name="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
      </Box>
      <Tabs label="Icons" tabs={tabs} contentBackground="white" />
    </>
  )
}
