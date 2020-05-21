import React from 'react'

import * as styles from './Page.treat'

export const Page: React.FC = ({ children }) => (
  <main className={styles.container}>{children}</main>
)

export default Page
