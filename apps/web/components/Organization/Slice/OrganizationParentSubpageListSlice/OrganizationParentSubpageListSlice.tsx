import { useRouter } from 'next/router'

import {
  Box,
  Button,
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
import { pathIsRoute } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './OrganizationParentSubpageList.css'

interface OrganizationParentSubpageListSliceProps {
  slice: OrganizationParentSubpageList
}

export const OrganizationParentSubpageListSlice = ({
  slice,
}: OrganizationParentSubpageListSliceProps) => {
  const { activeLocale } = useI18n()
  const router = useRouter()
  const isFrontpage = pathIsRoute(
    router.asPath,
    'organizationpage',
    activeLocale,
  )

  return (
    <Box marginLeft={!isFrontpage ? [0, 0, 0, 0, 6] : undefined}>
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
    </Box>
  )
}
