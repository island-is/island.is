import React, { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import localeIS from 'date-fns/locale/is'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import {
  Alert,
  Button,
  Typography,
  Tag,
  TagVariant,
} from '@island.is/island-ui/core'
import { Case, CaseState, User } from '../../types'
import * as api from '../../api'
import * as styles from './DetentionRequests.treat'
import { hasRole, UserRole } from '../../utils/authenticate'

export const DetentionRequests: React.FC = () => {
  const [cases, setCases] = useState<Case[]>(null)
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true

    async function getData() {
      const casesResponse = await api.getCases()
      const userResponse = await api.getUser()

      if (isMounted && casesResponse) {
        setUser({
          nationalId: userResponse.nationalId,
          roles: userResponse.roles,
        })

        if (hasRole(userResponse.roles, UserRole.JUDGE)) {
          const judgeCases = casesResponse.filter((c) => {
            return c.state === CaseState.SUBMITTED
          })
          setCases(judgeCases)
        } else {
          setCases(casesResponse)
        }
      }
      setIsLoading(false)
    }

    getData()

    return () => {
      isMounted = false
    }
  }, [])

  const mapCaseStateToTagVariant = (
    state: CaseState,
  ): { color: TagVariant; text: string } => {
    switch (state) {
      case CaseState.DRAFT:
        return { color: 'red', text: 'Drög' }
      case CaseState.SUBMITTED:
        return { color: 'purple', text: 'Krafa staðfest' }
      case CaseState.ACTIVE:
        return { color: 'darkerMint', text: 'Gæsluvarðhald virkt' }
      case CaseState.COMPLETED:
        return { color: 'blue', text: 'Gæsluvarðhaldi lokið' }
      default:
        return { color: 'white', text: 'Óþekkt' }
    }
  }

  return (
    <div className={styles.detentionRequestsContainer}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <div className={styles.addDetentionRequestButtonContainer}>
        <Button
          icon="plus"
          href="/stofna-krofu/grunnupplysingar"
          onClick={() => window.localStorage.removeItem('workingCase')}
        >
          Stofna nýja kröfu
        </Button>
      </div>
      {isLoading ? null : cases ? (
        <table
          className={styles.detentionRequestsTable}
          data-testid="detention-requests-table"
        >
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
              <tr key={i} data-testid="detention-requests-table-row">
                <td>{c.policeCaseNumber || '-'}</td>
                <td>{c.suspectName}</td>
                <td>{c.suspectNationalId || '-'}</td>
                <td>
                  {format(parseISO(c.created), 'PP', { locale: localeIS })}
                </td>
                <td>
                  <Tag variant={mapCaseStateToTagVariant(c.state).color} label>
                    {mapCaseStateToTagVariant(c.state).text}
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
      ) : (
        <div
          className={styles.detentionRequestsError}
          data-testid="detention-requests-error"
        >
          <Alert
            title="Ekki tókst að sækja gögn úr gagnagrunni"
            message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar"
            type="error"
          />
        </div>
      )}
    </div>
  )
}

export default DetentionRequests
