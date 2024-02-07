import { FieldBaseProps, ImageField } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './ImageFormField.css'
import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'

interface Props extends FieldBaseProps {
  field: ImageField
}

export const ImageFormField: FC<Props> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const fullWidth = field.imageWidth === 'full'
  const Image = field.image

  return (
    <Box
      marginTop={field.marginTop}
      marginBottom={field.marginBottom}
      className={fullWidth ? styles.fullWidth : undefined}
    >
      {field.title && (
        <Box marginBottom={1}>
          <Text variant={field.titleVariant ?? 'h4'}>
            {formatText(field.title, application, formatMessage)}
          </Text>
        </Box>
      )}
      {typeof field.image === 'string' ? (
        // Render a normal img element if the image is a string
        <img
          src={field.image}
          alt={field.alt}
          width={fullWidth ? '100%' : 'auto'}
          height="auto"
        />
      ) : (
        // Otherwise, render a svg component
        <Image />
      )}
    </Box>
  )
}
