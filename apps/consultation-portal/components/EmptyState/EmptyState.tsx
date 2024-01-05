import { Text } from '@island.is/island-ui/core'
import localization from './EmptyState.json'

interface EmptyStateProps {
  isCase?: boolean
}

const EmptyState = ({ isCase = false }: EmptyStateProps) => {
  const loc = isCase ? localization.caseEmptyState : localization.emptyState
  return <Text variant="h4">{loc.text}</Text>
}

export default EmptyState
