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
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import * as styles from './InfoScreen.treat'

interface Props {
  title: MessageDescriptor
  intro: MessageDescriptor
  list?: {
    title: MessageDescriptor
    items: MessageDescriptor[]
  }
  institutionTitle: MessageDescriptor
  institutionDescription: MessageDescriptor
  institutionHref: string
  institutionLinkTitle: MessageDescriptor
  figure: string
}

export const InfoScreen: FC<Props> = ({
  title,
  intro,
  list,
  institutionTitle,
  institutionDescription,
  institutionHref,
  institutionLinkTitle,
  figure,
}) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginBottom={[4, 6, 9]}>
        <GridRow>
          <GridColumn span={['12/12', '7/12']}>
            <Box marginTop={[2, 3, 8]} marginBottom={2}>
              <Box marginBottom={[2, 3]}>
                <Typography variant="h1">{formatMessage(title)}</Typography>
              </Box>
              <Box marginBottom={[3, 4, 6]}>
                <Typography variant="intro">{formatMessage(intro)}</Typography>
              </Box>
              {list && (
                <>
                  <Box marginBottom={[2, 3]}>
                    <Typography variant="h2">
                      {formatMessage(list.title)}
                    </Typography>
                  </Box>
                  <BulletList>
                    {list.items.map((item, index) => (
                      <Bullet key={index}>{formatMessage(item)}</Bullet>
                    ))}
                  </BulletList>
                </>
              )}
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '5/12']}>
            <img src={figure} alt={`skrautmynd fyrir ${title}`} />
          </GridColumn>
        </GridRow>
      </Box>
      <Box
        className={styles.externalCTA}
        paddingY={[6, 6, 6, 9]}
        paddingX={[3, 4, 7, 10, 15]}
        background="purple100"
      >
        <Box marginBottom={[3, 4]}>
          <Typography variant="h2">
            {formatMessage({
              id: 'service.portal:institution',
              defaultMessage: 'Stofnun',
            })}
          </Typography>
        </Box>
        <Box marginBottom={[2, 3]}>
          <Typography variant="h3">
            {formatMessage(institutionTitle)}
          </Typography>
        </Box>
        <Box marginBottom={[2, 3]}>
          <Typography variant="p">
            {formatMessage(institutionDescription)}
          </Typography>
        </Box>
        <ArrowLink href={institutionHref}>
          {formatMessage(institutionLinkTitle)}
        </ArrowLink>
      </Box>
    </>
  )
}
