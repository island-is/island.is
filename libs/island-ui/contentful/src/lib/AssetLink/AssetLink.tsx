import React, { FC } from 'react'
import { FocusableBox, LinkCard } from '@island.is/island-ui/core'

interface AssetLinkProps {
  url: string
}

export const AssetLink: FC<AssetLinkProps> = ({ url, children }) => {
  const parts = url.split('.')
  const extension = parts[parts.length - 1].toUpperCase()

  return (
    <FocusableBox href={url} border="standard" borderRadius="large">
      <LinkCard background="white" tag={extension}>
        {children}
      </LinkCard>
    </FocusableBox>
  )
}

export default AssetLink
