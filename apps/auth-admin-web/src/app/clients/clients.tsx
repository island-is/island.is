import React from 'react'
import { Box, Typography, Page, Text } from '@island.is/island-ui/core'
import * as styles from './Clients.treat'

import './clients.scss'

/* eslint-disable-next-line */
export interface ClientsProps {}

export const Clients = (props: ClientsProps) => {
  return (
    <div className={styles.container}>
      <input type="text"></input>
      <p>Clients</p>
    </div>
  )
}

export default Clients
