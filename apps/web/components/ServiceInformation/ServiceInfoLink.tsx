import React, { FC } from 'react'
import { Box, Link, Button } from '@island.is/island-ui/core'

interface ServiceInfoLinkProps {
  href: string
  link: string
}
export const ServiceInfoLink: FC<ServiceInfoLinkProps> = ({ href, link }) => {
  return (
    <Link href={href}>
      <Button
        fluid
        iconType="outline"
        icon="open"
        colorScheme="light"
        size="small"
        variant="text"
      >
        {link}
      </Button>
    </Link>
  )
}
export default ServiceInfoLink
