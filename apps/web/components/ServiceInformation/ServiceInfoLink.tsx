import React from 'react'

import { Button, Link } from '@island.is/island-ui/core'

interface ServiceInfoLinkProps {
  href: string
  link: string
}
export const ServiceInfoLink = ({ href, link }: ServiceInfoLinkProps) => {
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
