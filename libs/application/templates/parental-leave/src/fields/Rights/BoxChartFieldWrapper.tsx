import React, { FC } from 'react'

import { Field, FieldBaseProps } from '@island.is/application/core'

import BoxChart, { BoxChartProps } from '../components/BoxChart'

interface BoxChartFieldWrapperProps extends FieldBaseProps {
  field: Field & {
    props: BoxChartProps
  }
}
const BoxChartFieldWrapper: FC<BoxChartFieldWrapperProps> = ({
  field,
}: BoxChartFieldWrapperProps) => {
  return <BoxChart {...field.props} />
}
export default BoxChartFieldWrapper
