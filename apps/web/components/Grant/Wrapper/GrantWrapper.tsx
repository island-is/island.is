import { ReactNode, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { BreadCrumbItem } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { HeadWithSocialSharing } from '../../HeadWithSocialSharing/HeadWithSocialSharing'

type WrapperProps = {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: string
  children?: ReactNode
}

export const GrantWrapper = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  children,
}: WrapperProps) => {
  return (
    <>
      <HeadWithSocialSharing
        title={pageTitle}
        description={pageDescription}
        imageUrl={pageFeaturedImage}
      />
      {children}
    </>
  )
}
