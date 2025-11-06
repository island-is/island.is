import NextLink from 'next/link'

import { BreadCrumbItem, Breadcrumbs, TextProps } from "@island.is/island-ui/core"
import { CustomPageLayoutHeader, CustomPageLayoutHeaderProps, CustomPageLayoutWrapper, Footer } from "@island.is/web/components"
import { Organization } from '@island.is/web/graphql/schema'

interface Props {
  title: string
  description?: string
  featuredImage?: {
    src: string
    alt: string
  }
  header?: Omit<Partial<CustomPageLayoutHeaderProps>, 'breadcrumbs' | 'featuredImageAlt' | 'featuredImage'> & {breadcrumbs?: BreadCrumbItem[] }
  footer?: {
    organization: Organization
    color?: TextProps['color']
    background?: string
    titleVariant?: TextProps['variant'],
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
    {
      props.footer && (
        <Footer
          imageUrl={props.footer.organization.logo?.url}
          heading={props.footer.organization.title}
          columns={props.footer.organization.footerItems}
          color={props.footer.color}
          background={props.footer.background}
          titleVariant={props.footer.titleVariant ?? 'h2'}
        />
      )
    }
  </CustomPageLayoutWrapper>)
}
