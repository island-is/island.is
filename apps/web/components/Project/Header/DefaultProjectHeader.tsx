import React from 'react'
import {
  Box,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Link,
} from '@island.is/island-ui/core'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import * as styles from './DefaultProjectHeader.css'

const getTextBackgroundColor = (projectPage: ProjectPage) => {
  if (projectPage.defaultHeaderBackgroundColor)
    return projectPage.defaultHeaderBackgroundColor
  return 'linear-gradient(94.09deg, #0044B3 0%, #4783E4 100%)'
}

interface DefaultProjectHeaderProps {
  projectPage: ProjectPage
}

export const DefaultProjectHeader = ({
  projectPage,
}: DefaultProjectHeaderProps) => {
  const { linkResolver } = useLinkResolver()

  const defaultImageIsProvided =
    projectPage.defaultHeaderImage && projectPage.defaultHeaderImage.url

  const textBackgroundColor = getTextBackgroundColor(projectPage)

  return (
    <Box className={defaultImageIsProvided ? styles.headerWrapper : undefined}>
      <Box
        className={styles.headerBg}
        style={{ background: textBackgroundColor }}
      >
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '10/12', '7/12', '6/12']}
              offset={['0', '0', '1/12', '1/12', '1/12']}
            >
              <Text variant="eyebrow" color="white" marginTop={5}>
                Ísland.is
              </Text>
              <Link href={linkResolver('projectpage', [projectPage.slug]).href}>
                <Text variant="h1" color="white" marginTop={2}>
                  {projectPage.title}
                </Text>
              </Link>
              <Text variant="intro" color="white" marginTop={3}>
                {projectPage.subtitle}
              </Text>
              <Text color="white" marginTop={3}>
                {projectPage.intro}
              </Text>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {defaultImageIsProvided && (
        <img
          className={styles.headerImage}
          src={projectPage.defaultHeaderImage.url}
          alt="header"
        ></img>
      )}
    </Box>
  )
}
