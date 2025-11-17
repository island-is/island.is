import NextLink from 'next/link'

import {
  Box,
  BoxProps,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  TextProps,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  CustomPageLayoutHeader,
  CustomPageLayoutHeaderProps,
  CustomPageLayoutWrapper,
  Footer,
} from '@island.is/web/components'
import { Organization } from '@island.is/web/graphql/schema'

interface Props {
  title: string
  description?: string
  featuredImage?: {
    src: string
    alt: string
  }
  header?: Omit<
    Partial<CustomPageLayoutHeaderProps>,
    'breadcrumbs' | 'featuredImageAlt' | 'featuredImage'
  > & { breadcrumbs?: BreadCrumbItem[] }
  footer?: {
    organization: Organization
  }
  children?: React.ReactNode
}

export const OpenInvoicesWrapper = (props: Props) => {
  return (
    <CustomPageLayoutWrapper
      pageTitle={props.title}
      pageDescription={props.description}
      pageFeaturedImage={props.featuredImage?.src}
    >
      <CustomPageLayoutHeader
        title={props.header?.title ?? props.title}
        description={props.header?.description ?? props.description}
        shortcuts={props.header?.shortcuts}
        searchPlaceholder={props.header?.searchPlaceholder}
        searchUrl={props.header?.searchUrl}
        offset={props.header?.offset}
        featuredImage={props.featuredImage}
        breadcrumbs={
          props.header?.breadcrumbs && (
            <Breadcrumbs
              items={props.header.breadcrumbs ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href} legacyBehavior>
                    {link}
                  </NextLink>
                ) : (
                  link
                )
              }}
            />
          )
        }
      />
      {props.children}
      {props.footer && (
        <footer>
          <Box background="blue100" paddingTop={9} paddingBottom={12}>
            <GridContainer>
              <GridRow marginBottom={4}>
                <GridColumn span="1/12">
                  <img
                    src={props.featuredImage?.src}
                    alt={props.featuredImage?.alt}
                    width={590}
                  />
                </GridColumn>
                <GridColumn span="3/12">
                  <Text variant="h2">{'Opinberir reikningar'}</Text>
                </GridColumn>
              </GridRow>

              <GridRow>
                <GridColumn offset="1/12" span="2/12">
                  <Text marginBottom={1} variant="h5">
                    Heimilsfang
                  </Text>
                  <Text variant="medium">Hvergiland 100, 101 Reykjavík</Text>
                </GridColumn>
                <GridColumn span="2/12">
                  <Text marginBottom={1} variant="h5">
                    Opnunartími
                  </Text>
                  <Text variant="medium">Opið virka daga frá 9:00 - 15:00</Text>
                </GridColumn>
                <GridColumn span="4/12">
                  <Text marginBottom={1} variant="h5">
                    Hafðu samband
                  </Text>
                  <Text variant="medium" marginBottom={1}>
                    Sími: 480 6000
                  </Text>
                  <Text variant="medium">
                    Netfang: netfang@opinberirreikningar.is
                  </Text>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
        </footer>
      )}
    </CustomPageLayoutWrapper>
  )
}
