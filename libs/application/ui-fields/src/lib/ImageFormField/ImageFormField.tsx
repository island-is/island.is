import { FieldBaseProps, ImageField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import * as styles from './ImageFormField.css'
import { FC } from 'react'

interface Props extends FieldBaseProps {
  field: ImageField
}

export const ImageFormField: FC<Props> = ({ field }) => {
  const fullWidth = field.imageWidth === 'full'

  // Render a normal img element if the image is a string
  if (typeof field.image === 'string')
    return (
      <Box marginTop={field.marginTop} marginBottom={field.marginBottom}>
        <img
          src={field.image}
          alt={field.alt}
          width={fullWidth ? '100%' : 'auto'}
          height="auto"
        />
      </Box>
    )

  // Otherwise, render a svg component
  const Image = field.image

  return (
    <Box
      marginTop={field.marginTop}
      marginBottom={field.marginBottom}
      className={fullWidth ? styles.fullWidth : undefined}
    >
      <Image />
    </Box>
  )
}
