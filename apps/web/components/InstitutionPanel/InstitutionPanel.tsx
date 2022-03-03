import React from 'react'

import {
  Box,
  BoxProps,
  Hyphen,
  HyphenProps,
  Link,
  LinkProps,
  Text,
} from '@island.is/island-ui/core'

interface InstitutionPanelProps {
  img?: string
  institutionTitle: string
  institution: string
  locale: HyphenProps['locale']
  linkProps?: LinkProps
  imgContainerDisplay?: BoxProps['display']
}

export const InstitutionPanel = ({
  img,
  institutionTitle,
  institution,
  locale,
  linkProps,
  imgContainerDisplay,
}: InstitutionPanelProps) => {
  return (
    <Link {...linkProps}>
      <Box
        background="purple100"
        borderRadius="large"
        padding={[3, 3, 4]}
        display="flex"
        alignItems="center"
      >
        <Box
          display={imgContainerDisplay}
          style={{ flex: '0 0 64px' }}
          marginRight={3}
        >
          <Box
            component="img"
            alt=""
            src={img ? img : '/assets/skjaldarmerki.svg'}
            width="full"
          />
        </Box>
        <Box>
          <Text variant="eyebrow" color="purple600">
            {institutionTitle}
          </Text>
          <Text
            variant={institution.length > 24 ? 'h5' : 'h3'}
            as="h3"
            color="purple600"
            lineHeight="sm"
          >
            <Hyphen locale={locale}>{institution}</Hyphen>
          </Text>
        </Box>
      </Box>
    </Link>
  )
}

export default InstitutionPanel
