import React, { FC, Children } from 'react'
import { Typography } from '../Typography/Typography'

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
    <div className={styles.breadcrumbs} aria-label={label}>
      {crumbs.map((child, index) => (
        <span key={index} className={styles.crumb}>
          <Typography variant="breadcrumb" as="span">
            {child}
          </Typography>
          {crumbs.length - 1 > index && (
            <span className={styles.divider}>
              <Caret />
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

const Caret = () => (
  <svg
    width="6"
    height="10"
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.354609 1.03252C0.0458594 1.32502 0.0458594 1.79752 0.354609 2.09002L3.42628 5.00002L0.354609 7.91002C0.0458594 8.20252 0.0458594 8.67502 0.354609 8.96752C0.663359 9.26002 1.16211 9.26002 1.47086 8.96752L5.10461 5.52502C5.41336 5.23252 5.41336 4.76002 5.10461 4.46752L1.47086 1.02502C1.17003 0.740016 0.663359 0.740017 0.354609 1.03252Z"
      fill="#FF0050"
    />
  </svg>
)

export default Breadcrumbs
