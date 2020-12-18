import React, { FC, ReactNode } from 'react'
import { Text } from '../Text/Text'
import { Tag } from '../Tag/Tag'
import { Colors } from '@island.is/island-ui/theme'
import cn from 'classnames'
import * as styles from './Breadcrumbs.treat'

export interface BreadCrumbItem {
  title: string
  href?: string
  slug?: string[]
  typename?: string
}

interface BreadcrumbsProps {
  items: BreadCrumbItem[]
  tags?: string[]
  label?: string
  color?: keyof typeof styles.breadcrumb
  tagVariant?: string
  separatorColor?: Colors
  renderLink?: (link: ReactNode, item: BreadCrumbItem) => ReactNode
}

export const NewBreadcrumbs: FC<BreadcrumbsProps> = ({
  items,
  tags,
  label = 'breadcrumb',
  color = 'blue400',
  tagVariant = 'blue',
  renderLink = (link) => link,
}) => {
  return (
    <div aria-label={label} className={styles.wrapper}>
      {items.map((item, index) => {
        return (
          <span key={index} className={styles.wrapper}>
            {renderLink(
              item.href || item.slug ? (
                <a href={item?.href} className={styles.breadcrumb[color]}>
                  <Text as="span" variant={'eyebrow'}>
                    {item.title}
                  </Text>
                </a>
              ) : (
                <Text as="span" variant={'eyebrow'} color={color}>
                  {item.title}
                </Text>
              ),
              item,
            )}
            {items.length - 1 > index && (
              <span className={cn(styles.bullet, styles.color[color])}></span>
            )}
          </span>
        )
      })}
      {!!tags &&
        tags.map((tag, index) => {
          return (
            <span key={index} className={styles.wrapper}>
              <span className={cn(styles.bullet, styles.color[color])}></span>
              <Tag variant={tagVariant}>{tag}</Tag>
            </span>
          )
        })}
    </div>
  )
}
