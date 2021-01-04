import React, { FC, ReactNode } from 'react'
import { Text } from '../Text/Text'
import { Tag } from '../Tag/Tag'
import { TagVariant } from '../Tag/Tag'
import { Colors } from '@island.is/island-ui/theme'
import cn from 'classnames'
import * as styles from './Breadcrumbs.treat'

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

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  items,
  label = 'breadcrumb',
  color = 'blue400',
  tagVariant = 'blue',
  renderLink = (link) => link,
}) => {
  return (
    <div aria-label={label} className={styles.wrapper}>
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
          <span key={index} className={styles.wrapper}>
            {isLink
              ? renderLink(
                  <a
                    href={item?.href}
                    tabIndex={item.isTag ? -1 : undefined}
                    style={{
                      textDecoration: item.isTag ? 'none' : undefined,
                      display: 'inline-flex',
                    }}
                    className={cn(
                      styles.breadcrumb[color],
                      styles.focusable[color],
                    )}
                  >
                    {renderCrumb}
                  </a>,
                  item,
                )
              : renderCrumb}
            {items.length - 1 > index && (
              <span className={cn(styles.bullet, styles.color[color])}></span>
            )}
          </span>
        )
      })}
    </div>
  )
}
