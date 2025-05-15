import React, { FC } from 'react'
import { FocusableBox, LinkCard } from '@island.is/island-ui/core'

export interface AssetLinkProps {
  title: string
  url: string
}

export const AssetLink: FC<React.PropsWithChildren<AssetLinkProps>> = ({
  title,
  url,
  children,
}) => {
  const parts = url.split('.')
  let extension = parts[parts.length - 1].toUpperCase()

  if (url.includes('videos.ctfassets') && extension.length >= 10) {
    extension = 'VIDEO'
  }

  const secureUrl = `${url.startsWith('//') ? 'https:' : ''}${url}`

  return (
    <FocusableBox href={secureUrl} border="standard" borderRadius="large">
      <LinkCard background="white" tag={extension.length < 10 ? extension : ''}>
        {title || children}
      </LinkCard>
    </FocusableBox>
  )
}

export default AssetLink
