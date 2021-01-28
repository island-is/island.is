import {
  Box,
  Text,
  Hyphen,
  HyphenProps,
  Button,
  Link,
} from '@island.is/island-ui/core'
import React from 'react'

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
}

export const InstitutionsPanel = ({
  img,
  institution,
  responsibleParty = [],
  relatedInstitution = [],
  locale,
}: InstitutionsPanelProps) => {
  return (
    <Box background="purple100" borderRadius="large">
      <Box padding={[3, 3, 6]} display="flex" alignItems="center">
        <Box style={{ flex: '0 0 100px' }} marginRight={3}>
          <Box
            component="img"
            alt=""
            src={img ? img : '/assets/skjaldarmerki.svg'}
            width="full"
          />
        </Box>
        <Box>
          <LabeledLink
            label={institution.label}
            title={institution.title}
            href="#"
            large
          />
        </Box>
        <Box marginLeft="auto" display="none">
          <Button variant="ghost" icon="open" iconType="outline">
            Hafa samband
          </Button>
        </Box>
      </Box>
      {responsibleParty.length > 0 ||
        (relatedInstitution.length > 0 && (
          <Box
            borderTopWidth="standard"
            borderColor="purple200"
            padding={[3, 3, 6]}
            paddingBottom={[1, 1, 3]}
            display="flex"
            flexWrap="wrap"
          >
            {responsibleParty.map((institution, index) => (
              <Box marginRight={6} marginBottom={3}>
                <LabeledLink key={index} {...institution} />
              </Box>
            ))}
            {relatedInstitution.map((institution, index) => (
              <Box marginRight={6} marginBottom={3}>
                <LabeledLink key={index} {...institution} />
              </Box>
            ))}
          </Box>
        ))}
    </Box>
  )
}

const LabeledLink = ({
  label,
  title,
  href,
  large,
}: Institution & {
  large?: boolean
}) => (
  <>
    <Text variant="eyebrow" color="purple600">
      {label}
    </Text>
    <Link href={href}>
      <Button
        variant="text"
        icon="arrowForward"
        size={large ? 'large' : 'default'}
        nowrap
      >
        {title}
      </Button>
    </Link>
  </>
)

export default InstitutionsPanel
