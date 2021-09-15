import React from 'react'
import {
  Box,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Link,
} from '@island.is/island-ui/core'
import * as styles from './ElectionProjectHeader.treat'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface ElectionProjectHeaderProps {
  projectPage: ProjectPage
}

export const ElectionProjectHeader = ({
  projectPage,
}: ElectionProjectHeaderProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <Box className={styles.headerBg}>
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '8/12', '6/12', '6/12']}
            offset={['0', '0', '0', '1/12']}
          >
            <Text variant="eyebrow" color="white" marginTop={8}>
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
  )
}
