import React, { useMemo, useRef } from 'react'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

import * as styles from './DefaultProjectHeader.css'

const getTextBackgroundColor = (projectPage: ProjectPage) => {
  if (projectPage.defaultHeaderBackgroundColor)
    return projectPage.defaultHeaderBackgroundColor
  return 'linear-gradient(94.09deg, #0044B3 0%, #4783E4 100%)'
}

interface DefaultProjectHeaderProps {
  projectPage: ProjectPage
  headerImageObjectFit?: string
}

export const DefaultProjectHeader = ({
  projectPage,
  headerImageObjectFit = 'cover',
}: DefaultProjectHeaderProps) => {
  const { linkResolver } = useLinkResolver()

  const defaultImageIsProvided =
    projectPage.defaultHeaderImage && projectPage.defaultHeaderImage.url

  const textBackgroundColor = getTextBackgroundColor(projectPage)

  const { width } = useWindowSize()

  const isBelowLarge = width < theme.breakpoints.lg

  const textRef = useRef<HTMLDivElement | null>(null)

  const maxImageHeight = useMemo(() => {
    if (!textRef?.current) return 300
    return textRef.current.getBoundingClientRect().height
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width])

  return (
    <Box className={defaultImageIsProvided ? styles.headerWrapper : undefined}>
      <Box
        className={styles.headerBg}
        style={{ background: textBackgroundColor }}
      >
        <GridContainer>
          <Box ref={textRef}>
            <GridRow align="flexEnd">
              <GridColumn
                paddingTop={5}
                span={[
                  '12/12',
                  '12/12',
                  defaultImageIsProvided ? '10/12' : '12/12',
                  defaultImageIsProvided ? '10/12' : '12/12',
                  defaultImageIsProvided ? '8/12' : '12/12',
                ]}
              >
                <Text variant="eyebrow" color="white" marginTop={5}>
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
      {defaultImageIsProvided && (
        <Box
          className={styles.headerImageContainer}
          style={{ backgroundColor: textBackgroundColor }}
        >
          <img
            className={styles.headerImage}
            style={{
              maxHeight: !isBelowLarge ? maxImageHeight : undefined,
              objectFit: headerImageObjectFit,
            }}
            src={projectPage.defaultHeaderImage?.url}
            alt="header"
          />
        </Box>
      )}
    </Box>
  )
}
