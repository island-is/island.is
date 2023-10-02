import {
  Link,
  Box,
  Bullet,
  BulletList,
  GridColumn,
  GridRow,
  Inline,
  Icon,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { servicePortalOutboundLink } from '@island.is/plausible'
import { m } from '../../lib/messages'
import * as styles from './InfoScreen.css'
import { formatPlausiblePathToParams } from '../../utils/formatPlausiblePathToParams'
import { useLocation } from 'react-router-dom'

interface Props {
  title: MessageDescriptor
  intro: MessageDescriptor
  list?: {
    title: MessageDescriptor
    items: MessageDescriptor[]
  }
  externalHref?: string
  externalLinkTitle?: MessageDescriptor
  institutionTitle?: MessageDescriptor
  institutionSubtitle?: MessageDescriptor
  institutionDescription?: MessageDescriptor
  institutionHref?: string
  institutionLinkTitle?: MessageDescriptor
  inProgress?: boolean
  figure: string
}

export const InfoScreen: FC<React.PropsWithChildren<Props>> = ({
  title,
  intro,
  list,
  externalHref,
  externalLinkTitle,
  figure,
  inProgress = true,
}) => {
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()

  const trackExternalLinkClick = () => {
    servicePortalOutboundLink(formatPlausiblePathToParams(pathname))
  }
  return (
    <Box marginBottom={[4, 6, 9]}>
      <GridRow>
        <GridColumn span={['12/12', '7/12']} order={[2, 1]}>
          <Box marginBottom={2}>
            <Box display="flex" marginBottom={[2, 3]}>
              <Inline space={1}>
                <Text variant="h3" as="h1">
                  {formatMessage(title)}
                </Text>
                {inProgress && (
                  <Tag variant="blue">{formatMessage(m.inProgress)}</Tag>
                )}
              </Inline>
            </Box>
            <Box marginBottom={[3, 4, 6]}>
              <Text variant="default">{formatMessage(intro)}</Text>
            </Box>
            {list && (
              <>
                <Box marginBottom={[2, 3]}>
                  <Text variant="h4" as="h2">
                    {formatMessage(list.title)}
                  </Text>
                </Box>
                <BulletList>
                  {list.items.map((item, index) => (
                    <Bullet key={index}>{formatMessage(item)}</Bullet>
                  ))}
                </BulletList>
              </>
            )}
            {externalHref && externalLinkTitle && (
              <Box marginTop={[3, 4]} alignItems="center">
                <Link
                  className={styles.externalLink}
                  href={externalHref}
                  onClick={trackExternalLinkClick}
                  color="blue400"
                  underline="normal"
                  underlineVisibility="always"
                  newTab
                >
                  {formatMessage(externalLinkTitle)}{' '}
                  <Icon icon="open" type="outline" size="small" />
                </Link>
              </Box>
            )}
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '5/12']} order={[1, 2]}>
          <Box marginBottom={[3, 0]}>
            <img src={figure} alt="" />
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
