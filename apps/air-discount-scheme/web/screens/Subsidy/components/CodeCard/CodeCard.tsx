import React, { ReactNode } from 'react'
import { copyToClipboard } from '@island.is/air-discount-scheme-web/utils'
import { Box, Text, Button } from '@island.is/island-ui/core'

import { Colors } from '@island.is/island-ui/theme'

interface PropTypes {
  title: string
  subTitle?: string
  code?: string
  copyCodeText?: string
  codeSubText?: ReactNode
  noCode?: boolean
  noCodeMessage?: string
  variant?: 'default' | 'secondary' | 'disabled'
  onCopy?: () => void
}

type VariantOptions = {
  background: Colors
  borderColor: Colors
}

type BoxVariant = {
  [Type in PropTypes['variant']]: VariantOptions
}

const boxVariant: BoxVariant = {
  disabled: {
    background: 'dark100',
    borderColor: 'dark200',
  },
  default: {
    background: 'blue100',
    borderColor: 'blue200',
  },
  secondary: {
    background: 'purple100',
    borderColor: 'blue200',
  },
}

function CodeCard({
  title,
  subTitle,
  code,
  copyCodeText,
  codeSubText,
  noCodeMessage,
  variant = 'default',
  onCopy,
}: PropTypes) {
  return (
    <Box
      {...boxVariant[variant]}
      padding={2}
      borderWidth="standard"
      borderStyle="solid"
      borderRadius="xs"
      display={['block', 'flex', 'block', 'flex']}
      justifyContent="spaceBetween"
      alignItems={['flexStart', 'center', 'flexStart', 'center']}
      flexDirection={['column', 'row', 'column', 'row']}
    >
      <Box marginBottom={[3, 0, 3, 0]}>
        <Text variant="h3">{title}</Text>
        {subTitle && <Text>{subTitle}</Text>}
      </Box>
      {code ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent={[
            'spaceBetween',
            'flexStart',
            'spaceBetween',
            'flexStart',
          ]}
        >
          <Box
            component="div"
            marginRight={[2, 4]}
            textAlign={['left', 'right', 'left', 'right']}
          >
            <Text
              variant="h3"
              as="pre"
              title="Afsláttarkóði"
              color="roseTinted400"
            >
              {code}
            </Text>
            {codeSubText && <Text>{codeSubText}</Text>}
          </Box>
          <Button
            nowrap
            onClick={() => {
              copyToClipboard(code)
              if (onCopy) {
                onCopy()
              }
            }}
          >
            {copyCodeText}
          </Button>
        </Box>
      ) : (
        noCodeMessage && <Text variant="h5">{noCodeMessage}</Text>
      )}
    </Box>
  )
}

export default CodeCard
