import { ReactNode } from 'react'

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
