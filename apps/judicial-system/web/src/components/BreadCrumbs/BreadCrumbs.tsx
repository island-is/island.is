import { FC } from 'react'
import Link from 'next/link'

import { Box, Icon, Text } from '@island.is/island-ui/core'

export interface BreadcrumbLink {
  label: string
  href: string
}

type Segment = BreadcrumbLink | BreadcrumbLink[]

interface Props {
  links: Segment[]
}

/**
 * Groups consecutive BreadcrumbLink[] items in the links array together so they
 * render side-by-side with a "/" separator, while single BreadcrumbLink items
 * always start a new segment separated by "•".
 *
 * Example: [[link1], [link2], link3] → [[link1, link2], [link3]]
 */
const groupSegments = (links: Segment[]): BreadcrumbLink[][] => {
  const result: BreadcrumbLink[][] = []
  let lastWasArray = false

  for (const item of links) {
    if (Array.isArray(item)) {
      if (lastWasArray && result.length > 0) {
        result[result.length - 1].push(...item)
      } else {
        result.push([...item])
      }
      lastWasArray = true
    } else {
      result.push([item])
      lastWasArray = false
    }
  }

  return result
}

const BreadCrumbs: FC<Props> = ({ links }) => {
  const segments = groupSegments(links)

  return (
    <Box display="flex" alignItems="center">
      <Icon icon="home" size="small" color="purple300" />
      {segments.map((segment, segmentIndex) => (
        <Box key={segmentIndex} display="flex" alignItems="center">
          <Text color="purple300">{` • `}</Text>
          {segment.map((link, linkIndex) => (
            <Box key={link.href} display="flex" alignItems="center">
              {linkIndex > 0 && <Text color="purple300">{` / `}</Text>}
              <Link href={link.href}>
                <Text color="purple300">{link.label}</Text>
              </Link>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default BreadCrumbs
