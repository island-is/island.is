import { GridColumnProps, GridColumn } from '@island.is/island-ui/core'
import { ReactNode, Fragment } from 'react'

export const DoubleColumnRow = ({
  left,
  right,
  pushRight,
  span = ['1/1', '1/2'],
  bypass,
  children,
  ...props
}: {
  left?: ReactNode
  right?: ReactNode
  pushRight?: boolean
  bypass?: boolean
  children?: ReactNode
} & GridColumnProps) => {
  const onlyLeft = left && !right
  const onlyRight = right && !left

  if (children && pushRight) {
    return (
      <Fragment>
        <GridColumn hiddenBelow="sm" span={span} {...props} />
        <GridColumn span={span} {...props}>
          {children}
        </GridColumn>
      </Fragment>
    )
  }

  if (!left && !right && children) {
    return (
      <GridColumn span={span} {...props}>
        {children}
      </GridColumn>
    )
  }

  return onlyLeft ? (
    <Fragment>
      <GridColumn span={span} {...props}>
        {left}
      </GridColumn>
      <GridColumn hiddenBelow="sm" span={span} {...props} />
    </Fragment>
  ) : onlyRight ? (
    <Fragment>
      <GridColumn hiddenBelow="sm" span={span} {...props} />
      <GridColumn span={span} {...props}>
        {right}
      </GridColumn>
    </Fragment>
  ) : (
    <Fragment>
      <GridColumn span={span} {...props}>
        {left}
      </GridColumn>
      <GridColumn span={span} {...props}>
        {right}
      </GridColumn>
    </Fragment>
  )
}

export default DoubleColumnRow
