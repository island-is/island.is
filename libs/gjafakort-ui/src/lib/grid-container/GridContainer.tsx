import React from 'react'
import styles from './GridContainer.module.scss'

export const GridContainer: React.FC = ({ children }) => (
  <div className={styles.container}>{children}</div>
)

export default GridContainer
