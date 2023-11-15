import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import { Link } from 'react-router-dom'

import {
  ArrowLink,
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { FootNote, IntroHeader, PROVIDER_SLUG_MAP } from '../..'
import * as styles from './NavigationOverviewScreen.css'

interface Props {
  title: MessageDescriptor
  intro: MessageDescriptor
  navigation?: {
    title: MessageDescriptor
    intro?: MessageDescriptor
    image: string
    link: {
      title: MessageDescriptor
      href: string
    }
  }[]
  serviceProviderID?: string
}

export const NavigationOverviewScreen: FC<React.PropsWithChildren<Props>> = ({
  title,
  intro,
  navigation = [],
  serviceProviderID,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={[4, 6, 9]}>
      <IntroHeader
        title={title}
        intro={intro}
        serviceProviderSlug={PROVIDER_SLUG_MAP[serviceProviderID ?? '']}
      />

      {navigation.map((nav, index) => (
        <GridRow key={index} alignItems="center" marginBottom={[6, 6, 15]}>
          <GridColumn span={['8/8', '5/8']} order={[2, index % 2 ? 2 : 1]}>
            <Text variant="h4" as="h2" marginBottom={2}>
              {formatMessage(nav.title)}
            </Text>
            <Text marginBottom={[2, 2, 4]}>
              {nav.intro && formatMessage(nav.intro)}
            </Text>
            <Link to={nav.link.href}>
              <ArrowLink>{formatMessage(nav.link.title)}</ArrowLink>
            </Link>
          </GridColumn>
          <GridColumn span={['8/8', '2/8']} order={[1, index % 2 ? 1 : 2]}>
            <Box
              marginTop={[4, 0]}
              marginLeft={[4, 0]}
              className={styles.image}
            >
              <img src={nav.image} alt="" />
            </Box>
          </GridColumn>
        </GridRow>
      ))}
      <FootNote
        serviceProviderSlug={PROVIDER_SLUG_MAP[serviceProviderID ?? '']}
      />
    </Box>
  )
}
