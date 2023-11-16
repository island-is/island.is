import React, { useRef } from 'react'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

import * as styles from './GrindavikProjectHeader.css'

const getTextBackgroundColor = (projectPage: ProjectPage) => {
  if (projectPage.defaultHeaderBackgroundColor)
    return projectPage.defaultHeaderBackgroundColor
  return 'linear-gradient(94.09deg, #0044B3 0%, #4783E4 100%)'
}

interface GrindavikProjectHeaderProps {
  projectPage: ProjectPage
}

export const GrindavikProjectHeader = ({
  projectPage,
}: GrindavikProjectHeaderProps) => {
  const { linkResolver } = useLinkResolver()

  const textBackgroundColor = getTextBackgroundColor(projectPage)

  const textRef = useRef<HTMLDivElement | null>(null)

  return (
    <Box className={styles.headerWrapper}>
      <Box
        className={styles.headerBg}
        style={{ background: textBackgroundColor }}
      >
        <GridContainer>
          <Box ref={textRef}>
            <GridRow align="flexStart">
              <GridColumn
                paddingTop={5}
                paddingBottom={5}
                offset={['0', '0', '0', '0', '1/12']}
                span={['12/12', '12/12', '10/12', '10/12', '8/12']}
              >
                <Text
                  variant="eyebrow"
                  color="white"
                  marginTop={[0, 0, 0, 5, 5]}
                >
                  Ísland.is
                </Text>
                <Link
                  href={linkResolver('projectpage', [projectPage.slug]).href}
                >
                  <Text variant="h1" color="white" marginTop={2}>
                    {projectPage.title}
                  </Text>
                </Link>
                <Text variant="intro" color="white" marginTop={3}>
                  {projectPage.subtitle}
                </Text>
                <Text color="white" marginTop={3} marginBottom={3}>
                  {projectPage.intro}
                </Text>
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </Box>
      <Hidden below="lg">
        <Box
          className={styles.headerImageContainer}
          style={{ backgroundColor: textBackgroundColor }}
        >
          <img
            className={styles.headerImage}
            src={
              'https://images.ctfassets.net/8k0h54kbe6bj/72VBXAja5JUADJ6XBMCBgW/54fb65f782472598b231da29fbf3a971/grindavik.png'
            }
            alt="header"
          />
        </Box>
      </Hidden>
    </Box>
  )
}
