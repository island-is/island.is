import {
  Box,
  FocusableBox,
  Hyphen,
  Inline,
  Tag,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './OrganizationCard.css'

type OrganizationTag = {
  id: string
  label: string
}

interface OrganizationCardProps {
  heading: string
  href?: string
  tags?: OrganizationTag[]
  src?: string
  alt?: string
}

export const OrganizationCard = ({
  heading,
  href,
  tags = [],
  src,
  alt,
}: OrganizationCardProps) => {
  const hasTags = tags.length > 0

  return (
    <FocusableBox
      href={href}
      display="flex"
      flexDirection="column"
      paddingY={3}
      paddingX={3}
      borderRadius="large"
      borderColor="blue200"
      borderWidth="standard"
      height="full"
      width="full"
      background="white"
      color="blue"
      className={styles.card}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="flexStart"
        flexGrow={1}
      >
        <Box flexGrow={1}>
          <Text as="h3" variant="h4" color="dark400">
            <Hyphen>{heading}</Hyphen>
          </Text>
        </Box>
        {src && (
          <Box marginLeft={2} display="flex" flexShrink={0}>
            <img src={src} alt={alt ?? ''} className={styles.logo} />
          </Box>
        )}
      </Box>
      {hasTags && (
        <Box paddingTop={2} className={styles.tag}>
          <Inline space="smallGutter">
            {tags.map((tag) => (
              <Tag
                key={tag.id}
                outlined
                variant="blue"
                truncate
                textLeft
                hyphenate
              >
                {tag.label}
              </Tag>
            ))}
          </Inline>
        </Box>
      )}
    </FocusableBox>
  )
}
