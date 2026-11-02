import { Field, FieldBaseProps } from '@island.is/application/types'
import React, { FC } from 'react'
import BoxChart, { BoxChartProps } from '../components/BoxChart'

interface BoxChartFieldWrapperProps extends FieldBaseProps {
  field: Field & {
    props: BoxChartProps
  }
}
const BoxChartFieldWrapper: FC<
  React.PropsWithChildren<BoxChartFieldWrapperProps>
> = ({ field }: BoxChartFieldWrapperProps) => {
  return <BoxChart {...field.props} />
}
export default BoxChartFieldWrapper
