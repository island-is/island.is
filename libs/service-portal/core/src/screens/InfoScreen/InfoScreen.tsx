import {
  ArrowLink,
  Box,
  Bullet,
  BulletList,
  GridColumn,
  GridRow,
  Inline,
  Tag,
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
  externalHref?: string
  externalLinkTitle?: MessageDescriptor
  institutionTitle: MessageDescriptor
  institutionSubtitle: MessageDescriptor
  institutionDescription: MessageDescriptor
  institutionHref: string
  institutionLinkTitle: MessageDescriptor
  figure: string
}

export const InfoScreen: FC<Props> = ({
  title,
  intro,
  list,
  externalHref,
  externalLinkTitle,
  figure,
}) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginBottom={[4, 6, 9]}>
        <GridRow>
          <GridColumn span={['12/12', '7/12']}>
            <Box marginTop={[2, 3, 8]} marginBottom={2}>
              <Box display="flex" marginBottom={[2, 3]}>
                <Inline space={1}>
                  <Typography variant="h1">{formatMessage(title)}</Typography>
                  <Tag variant="mint">
                    {formatMessage({
                      id: 'service.portal:in-progress',
                      defaultMessage: 'Í vinnslu',
                    })}
                  </Tag>
                </Inline>
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
              {externalHref && externalLinkTitle && (
                <Box marginTop={[3, 4]}>
                  <ArrowLink href={externalHref}>
                    {formatMessage(externalLinkTitle)}
                  </ArrowLink>
                </Box>
              )}
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '5/12']}>
            <img src={figure} alt={`skrautmynd fyrir ${title}`} />
          </GridColumn>
        </GridRow>
      </Box>
    </>
  )
}
