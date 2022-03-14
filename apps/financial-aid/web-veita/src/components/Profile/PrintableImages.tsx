import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { ApplicationFile } from '@island.is/financial-aid/shared/lib'

interface Props {
  images: ApplicationFile[]
}

const PrintableImages = ({ images }: Props) => {
  console.log(images)
  return (
    <>
      <Box>jasjdja</Box>
    </>
  )
}

export default PrintableImages
