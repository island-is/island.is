import React from 'react'
import {
  GridContainer,
  GridRow,
  GridColumn,
  Text,
  Box,
  Link,
  Button,
} from '@island.is/island-ui/core'
import illustrationSvg from '../../assets/svg/illustration.svg'
import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'

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
  titleId?: string
  introText: string
  text?: string
  image?: ImageProps
  linkText: string
  linkUrl: LinkResolverResponse
}

export const IntroductionSection = ({
  subtitle,
  title,
  titleId,
  introText,
  text,
  linkUrl,
  linkText,
}: Props) => {
  const titleProps = titleId ? { id: titleId } : {}
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
            <img src={illustrationSvg} alt="" role="presentation" />
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
          <Text as="h2" variant="h1" paddingBottom={2} {...titleProps}>
            {title}
          </Text>
          <Text variant="intro" paddingBottom={text ? 2 : 0}>
            {introText}
          </Text>
          <Text>{text}</Text>
          <Box paddingY={2}>
            <Link {...linkUrl} skipTab>
              <Button
                icon="arrowForward"
                iconType="filled"
                variant="text"
                as="span"
              >
                {linkText}
              </Button>
            </Link>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default IntroductionSection
