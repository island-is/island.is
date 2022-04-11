import React from 'react'
import { Divider, GridRow } from '@island.is/island-ui/core'

interface PropTypes {
  children: React.ReactNode
}

function Row({ children }: PropTypes) {
  return (
    <>
      <GridRow>{children}</GridRow>
      <Divider />
    </>
  )
}

export default Row
