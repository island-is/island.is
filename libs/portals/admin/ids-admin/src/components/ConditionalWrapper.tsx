import { ReactNode } from 'react'

interface ConditionalWrapperProps {
  condition?: boolean
  children: ReactNode
  trueWrapper: (children: ReactNode) => JSX.Element
  falseWrapper?: (children: ReactNode) => JSX.Element
}

export function ConditionalWrapper({
  condition = false,
  children,
  trueWrapper,
  // eslint-disable-next-line react/jsx-no-useless-fragment
  falseWrapper = (children) => <>{children}</>,
}: ConditionalWrapperProps) {
  return condition ? trueWrapper(children) : falseWrapper(children)
}
