import { ReactNode, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import NextLink from 'next/link'

import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Button,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import { HeadWithSocialSharing } from '../../HeadWithSocialSharing/HeadWithSocialSharing'

type WrapperProps = {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: string
  breadcrumbItems?: BreadCrumbItem[]
  children?: ReactNode
  sidebarContent?: ReactNode
  goBackUrl?: string
  hideTitle?: boolean
}

export const GrantWrapper = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  breadcrumbItems,
  children,
  sidebarContent,
  goBackUrl,
  hideTitle,
}: WrapperProps) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | undefined>()
  //usePlausiblePageview(organization?.trackingDomain ?? undefined)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.md)
  }, [width])

  return (
    <>
      <HeadWithSocialSharing
        title={`pageTitle`}
        description={pageDescription}
        imageUrl={pageFeaturedImage}
      />
      {children}
    </>
  )
}
