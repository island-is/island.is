import React, { useRef } from 'react'
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
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { theme } from '@island.is/island-ui/theme'

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

  const textRef = useRef<HTMLDivElement | null>(null)

  const { width } = useWindowSize()

  const isBelowLarge = width < theme.breakpoints.lg

  console.log(textRef.current?.getBoundingClientRect())

  const maxImageHeight = !isBelowLarge
    ? textRef.current?.getBoundingClientRect()?.height ?? undefined
    : undefined

  return (
    <Box className={defaultImageIsProvided ? styles.headerWrapper : undefined}>
      <div
        className={styles.headerBg}
        style={{ background: textBackgroundColor }}
        ref={textRef}
      >
        <GridContainer>
          <div ref={textRef}>
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
          </div>
        </GridContainer>
      </div>
      {defaultImageIsProvided && (
        <img
          className={styles.headerImage}
          style={{
            maxHeight: maxImageHeight,
          }}
          src={projectPage.defaultHeaderImage.url}
          alt="header"
        ></img>
      )}
    </Box>
  )
}
