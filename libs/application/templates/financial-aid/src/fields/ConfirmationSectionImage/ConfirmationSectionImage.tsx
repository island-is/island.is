import React from 'react'
import { Box } from '@island.is/island-ui/core'

import { confirmationIllustration } from '../Shared.css'

const ConfirmationSectionImage = () => {
  return (
    <Box className={confirmationIllustration}>
      <img
        src={
          'https://images.ctfassets.net/8k0h54kbe6bj/6UGl8bkfOwUDKYveXfKkh0/c09265b9301b0be52c678a7197a64154/crc-application-submitted.svg'
        }
        alt=""
      />
    </Box>
  )
}
export default ConfirmationSectionImage
