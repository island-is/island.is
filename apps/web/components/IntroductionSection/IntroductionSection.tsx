import React, { FC } from 'react'
import Illustration from './TempIllustration'
import {
  GridContainer,
  GridRow,
  GridColumn,
  Text,
  Box,
  ArrowLink,
} from '@island.is/island-ui/core'

// TODO:
// This component is just hard coded for now.
// Needs to handle real content when it gets to go into Contentful
// and maybe have its content be RichText

type ImageProps = {
  title: string
  url: string
  contentType: string
  width: number
  height: number
}

interface Props {
  subtitle: string
  title: string
  introText: string
  text?: string
  image?: ImageProps
  linkText: string
  linkUrl: string
}

export const IntroductionSection: FC<Props> = ({
  subtitle,
  title,
  introText,
  text,
  linkUrl,
  linkText,
}) => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '4/12']}
          offset={[null, null, '1/12']}
        >
          <Box
            display="inlineFlex"
            height="full"
            width="full"
            alignItems="center"
            justifyContent="center"
          >
            <Illustration width="100%" />
          </Box>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '5/12']}
          offset={[null, null, '1/12']}
          paddingTop={4}
        >
          <Text variant="eyebrow" color="purple400" paddingBottom={2}>
            {subtitle}
          </Text>
          <Text as="h2" variant="h1" paddingBottom={2}>
            {title}
          </Text>
          <Text variant="intro" paddingBottom={text ? 2 : 0}>
            {introText}
          </Text>
          <Text variant="default">{text}</Text>
          <Box paddingY={2}>
            <ArrowLink href={linkUrl} color="blue400">
              {linkText}
            </ArrowLink>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default IntroductionSection
