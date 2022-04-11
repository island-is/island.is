import React from 'react'
import { Divider, GridRow, Hidden } from '@island.is/island-ui/core'

interface PropTypes {
  children: React.ReactNode
}

const Row = ({ children }: PropTypes) => {
  return (
    <>
      <GridRow>{children}</GridRow>
      <Hidden print below="md">
        <Divider />
      </Hidden>
    </>
  )
}

export default Row
