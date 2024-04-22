import { Problem } from '@island.is/react-spa/shared'

type DelegationsEmptyStateProps = {
  message: string
  imageAlt: string
}

export const DelegationsEmptyState = ({
  message,
  imageAlt,
}: DelegationsEmptyStateProps) => {
  return (
    <Problem
      type="no_data"
      message={message}
      imgSrc="./assets/images/educationDegree.svg"
      imgAlt={imageAlt}
      data-testid="delegations-empty-state"
    />
  )
}
