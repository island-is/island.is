import * as s from './RegulationsHomeIntro.treat'

import React, { ReactNode, useState } from 'react'
import { NamespaceGetter } from '@island.is/web/hooks'
import { RegulationHomeTexts } from './RegulationTexts.types'
import { RegulationsHomeProps } from '@island.is/web/screens/Regulations/RegulationsHome'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { MarkdownText, RichText } from '@island.is/web/components'
import { SliceType } from '@island.is/island-ui/contentful'

export type RegulationsHomeIntroProps = {
  document: RegulationsHomeProps['introText']
  getText: NamespaceGetter<RegulationHomeTexts>
  breadCrumbs: ReactNode
}

export const RegulationsHomeIntro = (props: RegulationsHomeIntroProps) => {
  const txt = props.getText
  const homeIntro = props.document

  const [showDetails, setShowDetails] = useState(false)

  let IntroContent: ReactNode
  let IntroImage: ReactNode
  if (homeIntro) {
    const { summary, body, featuredImage } = homeIntro

    IntroContent = (
      <>
        <div className={s.introSummary}>
          <MarkdownText>{summary}</MarkdownText>
        </div>

        {body && body.length > 0 && (
          <>
            <Box paddingTop={2} paddingBottom={2}>
              <Button
                variant="text"
                size="small"
                icon={showDetails ? 'chevronUp' : 'chevronDown'}
                onClick={() => setShowDetails(!showDetails)}
              >
                {txt('homeIntroShowDetails')}
              </Button>
            </Box>

            <Box className={s.introBody} hidden={!showDetails}>
              <RichText
                body={body as SliceType[]}
                config={{ defaultPadding: 2 }}
              />
            </Box>
          </>
        )}
      </>
    )
    IntroImage = featuredImage && (
      <img
        className={s.introImage}
        src={featuredImage.url}
        alt={featuredImage.title}
      />
    )
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          offset={['0', '0', '0', '0', '1/12']}
          span={['1/1', '1/1', '1/1', '9/12', '7/12']}
          paddingTop={[0, 0, 0, 8]}
          paddingBottom={2}
        >
          {props.breadCrumbs}
          <Text as="h1" variant="h1" marginTop={2} marginBottom={2}>
            {(homeIntro && homeIntro.title) || txt('homeIntroLegend')}
          </Text>
          {IntroContent}
        </GridColumn>

        {IntroImage && (
          <GridColumn span="3/12" hiddenBelow="lg" paddingTop={[0, 0, 0, 2]}>
            {IntroImage}
            {/* <RegulationsHomeImg /> */}
          </GridColumn>
        )}
      </GridRow>
    </GridContainer>
  )
}
