import React, { FC, ReactNode } from 'react'
import { Text } from '../Text/Text'
import { Tag } from '../Tag/Tag'
import { TagVariant } from '../Tag/Tag'
import { Box } from '../Box/Box'
import { Colors } from '@island.is/island-ui/theme'
import cn from 'classnames'
import * as styles from './Breadcrumbs.treat'

export interface BreadCrumbItem {
  title: string
  href?: string
  slug?: string[]
  typename?: string
  isTag?: boolean
  isCurrentPage?: boolean
}

interface BreadcrumbsProps {
  items: BreadCrumbItem[]
  label?: string
  color?: keyof typeof styles.breadcrumb
  tagVariant?: TagVariant
  separatorColor?: Colors
  renderLink?: (link: ReactNode, item: BreadCrumbItem) => ReactNode
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  items,
  label = 'breadcrumb',
  color = 'blue400',
  tagVariant = 'blue',
  renderLink = (link) => link,
}) => {
  const visibleItems = items.filter((x) => x.title)

  return (
    <Box
      component="nav"
      aria-label={label}
      display={'inlineFlex'}
      alignItems={'center'}
    >
      {visibleItems.map((item, index) => {
        const isLink: boolean = !!item.href || !!item.slug || !!item.title
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
                    {...(item.isCurrentPage && { 'aria-current': 'page' })}
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
            {visibleItems.length - 1 > index && (
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
