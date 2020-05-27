import React, { FC, Children } from 'react'
import { Typography } from '../Typography/Typography'
import Icon from '../Icon/Icon'
import { theme } from '../../theme/'

import * as styles from './Breadcrumbs.treat'

interface BreadcrumbsProps {
  label?: string
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  label = 'breadcrumb',
  children,
}) => {
  const crumbs = Children.toArray(children).filter((c) => c)

  return (
    <div aria-label={label}>
      {crumbs.map((child, index) => (
        <span key={index}>
          <Typography variant="breadcrumb" as="span">
            {child}
          </Typography>
          {crumbs.length - 1 > index && (
            <span className={styles.divider}>
              <Icon type="bullet" width="4" color={theme.color.roseTinted400} />
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

export default Breadcrumbs
