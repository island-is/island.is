import React from 'react'
import { Box } from '@island.is/island-ui/core'

import { confirmationIllustration } from '../Shared.css'

const ConfirmationSectionImage = () => {
  return (
    <Box className={confirmationIllustration}>
      <img
        src={
          'https://images.ctfassets.net/8k0h54kbe6bj/76vWi6FRQd37hITKClZzvy/bb961452776ed1051a748b1e508c1576/fa-application-submitted.svg'
        }
        alt=""
      />
    </Box>
  )
}
export default ConfirmationSectionImage
