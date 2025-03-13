import React from 'react'

import {
  Box,
  Button,
  Hyphen,
  HyphenProps,
  Link,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './InstitutionsPanel.css'

type Institution = {
  label: string
  title: string
  href: string
}

interface InstitutionsPanelProps {
  img?: string
  institution: Institution
  locale: HyphenProps['locale']
  responsibleParty?: Institution[]
  relatedInstitution?: Institution[]
  contactText?: string
  onContactClick?: () => void
}

export const InstitutionsPanel = ({
  img,
  institution,
  responsibleParty = [],
  relatedInstitution = [],
  locale,
  contactText,
  onContactClick,
}: InstitutionsPanelProps) => {
  return (
    <Box background="purple100" borderRadius="large">
      <Box padding={[3, 3, 6]}>
        <Box
          display="flex"
          alignItems="center"
          flexDirection={['column', 'column', 'column', 'row']}
          flexWrap="wrap"
          justifyContent="spaceBetween"
          className={styles.negativeTop}
        >
          <Box
            display="flex"
            alignItems="center"
            flexDirection={['column', 'column', 'column', 'row']}
            marginTop={3}
          >
            <Box
              component="img"
              alt=""
              src={img ? img : '/assets/skjaldarmerki.svg'}
              width="full"
              className={styles.imgContainer}
              marginRight={[0, 0, 0, 3]}
            />
            <Box
              textAlign={['center', 'center', 'center', 'left']}
              marginRight={[0, 0, 0, 3]}
              flexGrow={1}
            >
              <LabeledLink
                label={institution.label}
                title={institution.title}
                href={institution.href}
                locale={locale}
              />
            </Box>
          </Box>
          {onContactClick && (
            <Box marginTop={3}>
              <Button
                variant="ghost"
                icon="open"
                iconType="outline"
                nowrap
                onClick={onContactClick}
              >
                {contactText}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {(responsibleParty.length > 0 || relatedInstitution.length > 0) && (
        <Box
          borderTopWidth="standard"
          borderColor="purple200"
          padding={[3, 3, 6]}
          paddingBottom={[1, 1, 3]}
          display="flex"
          flexWrap="wrap"
          flexDirection={['column', 'column', 'column', 'row']}
          textAlign={['center', 'center', 'center', 'left']}
        >
          {responsibleParty.map((institution, index) => (
            <Box marginRight={[0, 0, 0, 6]} marginBottom={5}>
              <LabeledLink key={index} {...institution} locale={locale} />
            </Box>
          ))}
          {relatedInstitution.map((institution, index) => (
            <Box marginRight={[0, 0, 0, 6]} marginBottom={5}>
              <LabeledLink key={index} {...institution} locale={locale} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

const LabeledLink = ({
  label,
  title,
  href,
  locale,
}: Institution & {
  locale: InstitutionsPanelProps['locale']
}) => (
  <>
    <Text variant="eyebrow" color="purple600" marginBottom="p2">
      {label}
    </Text>
    <Link href={href}>
      <Button variant="text" icon="arrowForward">
        <Hyphen locale={locale}>{title}</Hyphen>
      </Button>
    </Link>
  </>
)

export default InstitutionsPanel
