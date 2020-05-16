import React from 'react'
import * as styles from './GridContainer.treat'

export const GridContainer: React.FC = ({ children }) => (
  <div className={styles.container}>{children}</div>
)

export default GridContainer
