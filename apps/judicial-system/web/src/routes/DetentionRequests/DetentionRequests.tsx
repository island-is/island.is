import React, { useEffect, useState } from 'react'
import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import { Button, Typography, Tag, TagVariant } from '@island.is/island-ui/core'
import { Case, CaseState } from '../../types'
import * as api from '../../api'
import * as styles from './DetentionRequests.treat'

export const DetentionRequests: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([])

  useEffect(() => {
    async function getCases() {
      const response = await api.getCases()
      setCases(response)
    }

    getCases()
  }, [])

  const mapCaseStateToTagVariant = (status: CaseState): TagVariant => {
    switch (status) {
      case CaseState.DRAFT:
        return 'red'
      case CaseState.SUBMITTED:
        return 'purple'
      case CaseState.ACTIVE:
        return 'darkerMint'
      case CaseState.COMPLETED:
        return 'blue'
      default:
        return 'white'
    }
  }

  return (
    <div className={styles.detentionRequestsContainer}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <div className={styles.addDetentionRequestButtonContainer}>
        <Button icon="plus">Stofna nýja kröfu</Button>
      </div>
      <table className={styles.detentionRequestsTable}>
        <Typography as="caption" variant="h3">
          Gæsluvarðhaldskröfur
        </Typography>
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
          {cases.map((c, i) => (
            <tr key={i}>
              <td>{c.id || '-'}</td>
              <td>{c.suspectName}</td>
              <td>{c.suspectNationalID || '-'}</td>
              <td>{format(c.created, 'PP', { locale: localeIS })}</td>
              <td>
                <Tag variant={mapCaseStateToTagVariant(c.status)} label>
                  {c.status}
                </Tag>
              </td>
              <td>
                <Button href="/" icon="arrowRight" variant="text">
                  Opna kröfu
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DetentionRequests
