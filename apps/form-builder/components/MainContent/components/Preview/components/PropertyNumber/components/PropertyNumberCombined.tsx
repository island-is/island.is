import { Tabs } from '@island.is/island-ui/core'
import PropertyNumberList from './PropertyNumberList'
import PropertyNumberInput from './PropertyNumberInput'

export default function PropertyNumberCombined() {
  return (
    <Tabs
      label="Fasteignanúmer"
      tabs={[
        {
          label: 'Fasteignalisti',
          content: <PropertyNumberList />,
        },
        {
          label: 'Fasteignanúmerinnsláttur',
          content: <PropertyNumberInput />,
        },
      ]}
      contentBackground="blue100"
    />
  )
}
