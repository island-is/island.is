import {
  Box,
  Text,
  Hyphen,
  HyphenProps,
  BoxProps,
} from '@island.is/island-ui/core'
import * as styles from './InstitutionPanel.css'
import React from 'react'

interface InstitutionPanelProps {
  img?: string
  institutionTitle: string
  institution: string
  locale: HyphenProps['locale']
  linkHref: string
}

export const InstitutionPanel = ({
  img,
  institutionTitle,
  institution,
  locale,
  linkHref,
}: InstitutionPanelProps) => {
  return (
    <a
      href={linkHref}
      target="_blank"
      rel="noreferrer noopener"
      className={styles.link}
    >
      <Box
        background="purple100"
        borderRadius="large"
        padding={[3, 3, 4]}
        display="flex"
        alignItems="center"
      >
        <Box display="flex" style={{ flex: '0 0 64px' }} marginRight={3}>
          <Box
            component="img"
            alt=""
            src={img ? img : './assets/images/skjaldarmerki.svg'}
            width="full"
            height="full"
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
    </a>
  )
}

export default InstitutionPanel
