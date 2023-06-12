import React, { FC, ReactNode } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { Tag } from '../Tag/Tag'
import { TagVariant } from '../Tag/Tag'
import { Colors } from '@island.is/island-ui/theme'
import cn from 'classnames'
import * as styles from './Breadcrumbs.css'

export interface BreadCrumbItem {
  title: string
  href?: string
  slug?: string[]
  typename?: string
  isTag?: boolean
}

interface BreadcrumbsProps {
  items: BreadCrumbItem[]
  label?: string
  color?: keyof typeof styles.breadcrumb
  tagVariant?: TagVariant
  separatorColor?: Colors
  renderLink?: (link: ReactNode, item: BreadCrumbItem) => ReactNode
}

export const Breadcrumbs: FC<React.PropsWithChildren<BreadcrumbsProps>> = ({
  items,
  label = 'breadcrumb',
  color = 'blue400',
  tagVariant = 'blue',
  renderLink = (link) => link,
}) => {
  return (
    <Box aria-label={label} display={'inlineFlex'} alignItems={'center'}>
      {items.map((item, index) => {
        const isLink: boolean = !!item.href || !!item.slug
        const renderCrumb = item.isTag ? (
          <Tag disabled={!isLink} variant={tagVariant}>
            {item.title}
          </Tag>
        ) : (
          <Text
            as="span"
            variant={'eyebrow'}
            color={isLink ? undefined : color}
          >
            {item.title}
          </Text>
        )

        return (
          <Box key={index} display={'inlineFlex'} alignItems={'center'}>
            {isLink
              ? renderLink(
                  <a
                    href={item?.href}
                    tabIndex={item.isTag ? -1 : undefined}
                    className={cn(
                      styles.breadcrumb[color],
                      styles.focusable[color],
                      { [styles.isTag]: item.isTag },
                    )}
                  >
                    {renderCrumb}
                  </a>,
                  item,
                )
              : renderCrumb}
            {items.length - 1 > index && (
              <Box
                borderRadius={'circle'}
                display={'inlineBlock'}
                marginY={0}
                marginX={1}
                className={cn(styles.bullet, styles.color[color])}
              ></Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
