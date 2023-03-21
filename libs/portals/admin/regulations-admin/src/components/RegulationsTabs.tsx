import { SkeletonLoader, Tabs } from '@island.is/island-ui/core'
import { homeMessages } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useShippedRegulationsQuery } from '../utils/dataHooks'
import { TaskList } from './TaskList'
import { ShippedRegulations } from './ShippedRegulations'

export const RegulationsTabs = () => {
  const { formatMessage } = useLocale()
  const t = formatMessage
  const shippedRegs = useShippedRegulationsQuery()

  if (shippedRegs.loading || shippedRegs.error) {
    return <SkeletonLoader width="500" height="300" />
  }
  const hasShippedRegs = shippedRegs.data.length > 0

  const TaskListContent = <TaskList />
  const ShippedRegulationsContent = (
    <ShippedRegulations shippedRegs={shippedRegs.data} />
  )

  const tabs = [
    {
      label: t(homeMessages.taskListTitle),
      content: TaskListContent,
    },
  ]
  hasShippedRegs &&
    tabs.push({
      label: t(homeMessages.shippedTitle),
      content: ShippedRegulationsContent,
    })

  return hasShippedRegs ? (
    <Tabs label="Reglugerðir" tabs={tabs} contentBackground="white" />
  ) : (
    TaskListContent
  )
}
