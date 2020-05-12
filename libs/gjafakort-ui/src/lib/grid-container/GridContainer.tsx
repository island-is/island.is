import React from 'react'

import styles from './GridContainer.scss'

/* eslint-disable-next-line */
export interface GridContainerProps {}

export const GridContainer: React.FC<GridContainerProps> = ({ children }) => (
  <div className={styles.container}>{children}</div>
)

export default GridContainer
