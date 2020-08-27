import React from 'react'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import * as styles from './DetentionRequests.treat'
import { Button, Typography } from '@island.is/island-ui/core'

export const DetentionRequests = () => {
  return (
    <div className={styles.detentionRequestsContainer}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <div className={styles.addDetentionRequestButtonContainer}>
        <Button icon="plus">Stofna nýja kröfu</Button>
      </div>
      <table className={styles.detentionRequestsTable}>
        <caption>
          <Typography as="h3" variant="h3">
            Gæsluvarðhaldskröfur
          </Typography>
        </caption>
        <thead>
          <tr>
            <th>LÖKE málsnr.</th>
            <th>Nafn grunaða</th>
            <th>Kennitala</th>
            <th>Krafa stofnuð</th>
            <th>Staða</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>-</td>
            <td>Róbert Guðni Arnarsson</td>
            <td>-</td>
            <td>03. júní 2020</td>
            <td>Drög</td>
            <td>
              <Button href="/" icon="arrowRight" variant="text">
                Opna kröfu
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DetentionRequests
