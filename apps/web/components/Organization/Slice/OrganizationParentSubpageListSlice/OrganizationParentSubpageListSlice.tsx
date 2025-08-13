import type { PropsWithChildren } from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  LinkV2,
  ProfileCard,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { IconTitleCard } from '@island.is/web/components'
import {
  OrganizationParentSubpageList,
  OrganizationParentSubpageListVariant,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './OrganizationParentSubpageList.css'

interface OrganizationParentSubpageListSliceProps {
  slice: OrganizationParentSubpageList
  isFrontpage?: boolean
}

const Wrapper = ({
  slice,
  isFrontpage,
  children,
}: PropsWithChildren<OrganizationParentSubpageListSliceProps>) => {
  if (isFrontpage) {
    return <div>{children}</div>
  }

  if (
    slice.pageLinkVariant ===
    OrganizationParentSubpageListVariant.ProfileCardWithTitleAbove
  ) {
    return <Box marginLeft={[0, 0, 0, 0, 6]}>{children}</Box>
  }

  if (
    slice.pageLinkVariant === OrganizationParentSubpageListVariant.ServiceCard
  ) {
    return (
      <GridContainer>
        <GridRow>
          <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
            {children}
          </GridColumn>
        </GridRow>
      </GridContainer>
    )
  }

  return <div>{children}</div>
}

export const OrganizationParentSubpageListSlice = ({
  slice,
  isFrontpage = false,
}: OrganizationParentSubpageListSliceProps) => {
  const { activeLocale } = useI18n()

  return (
    <Wrapper slice={slice} isFrontpage={isFrontpage}>
      <Stack space={4}>
        {slice.title && <Text variant="h3">{slice.title}</Text>}
        {slice.pageLinkVariant ===
          OrganizationParentSubpageListVariant.ServiceCard && (
          <Box className={styles.serviceCardContainer}>
            {slice.pageLinks.map((page) => (
              <IconTitleCard
                key={page.id}
                heading={page.label}
                href={page.href}
                imgSrc={page.tinyThumbnailImageHref ?? ''}
                alt=""
              />
            ))}
          </Box>
        )}
        {slice.pageLinkVariant ===
          OrganizationParentSubpageListVariant.ProfileCardWithTitleAbove && (
          <Box className={styles.profileCardContainer}>
            {slice.pageLinks.map((page) => (
              <LinkV2 key={page.id} href={page.href}>
                <ProfileCard
                  heightFull={true}
                  variant="title-above"
                  size="small"
                  title={page.label}
                  link={{
                    text: activeLocale === 'is' ? 'Sjá nánar' : 'See more',
                    url: page.href,
                  }}
                  description={page.pageLinkIntro}
                  image={page.thumbnailImageHref ?? ''}
                />
              </LinkV2>
            ))}
          </Box>
        )}
        {!!slice.seeMoreLink?.text && !!slice.seeMoreLink?.url && (
          <Box display="flex" justifyContent="flexEnd">
            <LinkV2 href={slice.seeMoreLink.url}>
              <Button
                variant="text"
                as="span"
                unfocusable={true}
                icon="arrowForward"
              >
                {slice.seeMoreLink.text}
              </Button>
            </LinkV2>
          </Box>
        )}
      </Stack>
    </Wrapper>
  )
}
