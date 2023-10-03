import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { m } from '../../lib/messages'

export const DelegationsEmptyState = () => {
  const { formatMessage } = useLocale()

  return (
    <Problem
      type="not_found"
      message={formatMessage(m.noDelegations)}
      imgSrc="./assets/images/educationDegree.svg"
      imgAlt={formatMessage(m.noDelegationsImageAlt)}
      data-testid="delegations-empty-state"
    />
  )
}
