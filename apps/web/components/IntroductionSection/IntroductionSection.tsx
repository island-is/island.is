import React, { FC } from 'react'
import * as styles from './styles'
import { Illustration } from './TempIllustration'
import {
  GridContainer,
  GridRow,
  GridColumn,
  Typography,
  Box,
} from '@island.is/island-ui/core'

// TODO: Make this component handle images from Contentful
// when we get more Content Models quota. :|

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
  text: string
  image?: ImageProps
  linkText: string
  linkUrl: string
}

const IntroductionSection: FC<Props> = ({ subtitle, title, text }) => {
  return (
    <Box paddingY={8}>
      <GridContainer>
        <GridRow>
          <GridColumn span={[12, 12, 4]} offset={[null, null, 1]}>
            <Illustration />
          </GridColumn>
          <GridColumn
            span={[12, 12, 5]}
            offset={[null, null, 1]}
            paddingTop={4}
          >
            <Typography variant="eyebrow" color="purple400" paddingBottom={2}>
              {subtitle}
            </Typography>
            <Typography as="h2" variant="h1" paddingBottom={2}>
              {title}
            </Typography>
            <Typography variant="p">{text}</Typography>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default IntroductionSection
