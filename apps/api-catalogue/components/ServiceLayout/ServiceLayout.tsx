import React, { ReactNode } from 'react'
import { Layout } from '../Layout'
import {
  Box,
  ContentBlock,
  GridRow,
  GridColumn,
  GridContainer,
} from '@island.is/island-ui/core'

interface PropTypes {
  top?: ReactNode
  left: ReactNode
  right?: ReactNode
  bottom?: ReactNode
  className?: string
  listClassNames?: string
}

const ServiceLayout = ({
  top,
  left,
  right,
  bottom,
  className,
  listClassNames,
}: PropTypes) => {
  return (
    <Box paddingX="gutter">
      <Layout left={top} />
      <GridContainer className={className}>
        <GridRow className={listClassNames}>
          <GridColumn
            span={['12/12', '8/12', '8/12', '9/12', '9/12']}
            offset={['0', '0', '0', '0', '0']}
          >
            {left}
          </GridColumn>
          <GridColumn
            span={['12/12', '4/12', '4/12', '3/12', '3/12']}
            offset={['0', '0', '0', '0', '0']}
          >
            {right}
          </GridColumn>
        </GridRow>
      </GridContainer>
      <ContentBlock>{bottom}</ContentBlock>
    </Box>
  )
}

export default ServiceLayout
