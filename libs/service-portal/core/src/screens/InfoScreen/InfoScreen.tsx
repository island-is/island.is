import {
  ArrowLink,
  Box,
  Bullet,
  BulletList,
  GridColumn,
  GridRow,
  Typography,
} from '@island.is/island-ui/core'
import React, { FC } from 'react'
import * as styles from './InfoScreen.treat'

interface Props {
  title: string
  intro: string
  list?: {
    title: string
    items: string[]
  }
  institutionTitle: string
  institutionDescription: string
  institutionHref: string
  institutionLinkTitle: string
  renderFigure: () => JSX.Element | null
}

export const InfoScreen: FC<Props> = ({
  title,
  intro,
  list,
  institutionTitle,
  institutionDescription,
  institutionHref,
  institutionLinkTitle,
  renderFigure,
}) => {
  return (
    <>
      <Box marginBottom={[4, 6, 9]}>
        <GridRow>
          <GridColumn span={['12/12', '7/12']}>
            <Box marginTop={[2, 3, 8]} marginBottom={2}>
              <Box marginBottom={[2, 3]}>
                <Typography variant="h1">{title}</Typography>
              </Box>
              <Box marginBottom={[3, 4, 6]}>
                <Typography variant="intro">{intro}</Typography>
              </Box>
              {list && (
                <>
                  <Box marginBottom={[2, 3]}>
                    <Typography variant="h2">{list.title}</Typography>
                  </Box>
                  <BulletList>
                    {list.items.map((item, index) => (
                      <Bullet key={index}>{item}</Bullet>
                    ))}
                  </BulletList>
                </>
              )}
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '5/12']}>{renderFigure()}</GridColumn>
        </GridRow>
      </Box>
      <Box
        className={styles.externalCTA}
        paddingY={[6, 6, 6, 9]}
        paddingX={[3, 4, 7, 10, 15]}
        background="purple100"
      >
        <Box marginBottom={[3, 4]}>
          <Typography variant="h2">Stofnun</Typography>
        </Box>
        <Box marginBottom={[2, 3]}>
          <Typography variant="h3">{institutionTitle}</Typography>
        </Box>
        <Box marginBottom={[2, 3]}>
          <Typography variant="p">{institutionDescription}</Typography>
        </Box>
        <ArrowLink href={institutionHref}>{institutionLinkTitle}</ArrowLink>
      </Box>
    </>
  )
}
