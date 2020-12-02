import React, { useEffect, useState, useContext } from 'react'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import localeIS from 'date-fns/locale/is'

import {
  JudgeLogo,
  ProsecutorLogo,
} from '@island.is/judicial-system-web/src/shared-components/Logos'
import {
  AlertMessage,
  Button,
  Text,
  Tag,
  TagVariant,
  Box,
} from '@island.is/island-ui/core'
import Loading from '../../../shared-components/Loading/Loading'
import { Case, CaseState } from '@island.is/judicial-system/types'
import * as styles from './DetentionRequests.treat'
import { UserRole } from '@island.is/judicial-system/types'
import * as Constants from '../../../utils/constants'
import { Link } from 'react-router-dom'
import { formatDate } from '@island.is/judicial-system/formatters'
import { insertAt } from '../../../utils/formatters'
import { gql, useQuery } from '@apollo/client'
import { UserContext } from '../../../shared-components/UserProvider/UserProvider'
import { useHistory } from 'react-router-dom'

export const CasesQuery = gql`
  query CasesQuery {
    cases {
      id
      created
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      isCourtDateInThePast
      custodyEndDate
      isCustodyEndDateInThePast
    }
  }
`

export const DetentionRequests: React.FC = () => {
  const [cases, setCases] = useState<Case[]>()
  const { user } = useContext(UserContext)
  const history = useHistory()

  const isJudge = user?.role === UserRole.JUDGE

  useEffect(() => {
    document.title = 'Allar kröfur - Réttarvörslugátt'
  }, [])

  const { data, error, loading } = useQuery(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  const resCases = data?.cases

  useEffect(() => {
    if (resCases && !cases) {
      if (isJudge) {
        const judgeCases = resCases.filter((c: Case) => {
          // Judges should see all cases except cases with status code NEW.
          return c.state !== CaseState.NEW
        })

        setCases(judgeCases)
      } else {
        setCases(resCases)
      }
    }
  }, [cases, isJudge, resCases, setCases])

  const mapCaseStateToTagVariant = (
    state: CaseState,
  ): { color: TagVariant; text: string } => {
    switch (state) {
      case CaseState.DRAFT || CaseState.NEW:
        return { color: 'red', text: 'Drög' }
      case CaseState.SUBMITTED:
        return { color: 'purple', text: 'Krafa staðfest' }
      case CaseState.ACCEPTED:
        return { color: 'darkerMint', text: 'Gæsluvarðhald virkt' }
      case CaseState.REJECTED:
        return { color: 'blue', text: 'Gæsluvarðhaldi hafnað' }
      default:
        return { color: 'white', text: 'Óþekkt' }
    }
  }

  const handleClick = (c: Case): void => {
    if (c.state === CaseState.ACCEPTED || c.state === CaseState.REJECTED) {
      history.push(`${Constants.SIGNED_VERDICT_OVERVIEW}/${c.id}`)
    } else if (isJudge) {
      history.push(`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${c.id}`)
    } else if (c.isCourtDateInThePast) {
      history.push(`${Constants.STEP_THREE_ROUTE}/${c.id}`)
    } else {
      history.push(`${Constants.SINGLE_REQUEST_BASE_ROUTE}/${c.id}`)
    }
  }

  return (
    <div className={styles.detentionRequestsContainer}>
      {user && (
        <div className={styles.logoContainer}>
          {isJudge ? <JudgeLogo /> : <ProsecutorLogo />}
          {!isJudge && (
            <Link
              to={Constants.SINGLE_REQUEST_BASE_ROUTE}
              style={{ textDecoration: 'none' }}
            >
              <Button icon="add">Stofna nýja kröfu</Button>
            </Link>
          )}
        </div>
      )}
      {cases ? (
        <table
          className={styles.detentionRequestsTable}
          data-testid="detention-requests-table"
        >
          <Text as="caption" variant="h3">
            <Box marginBottom={3}>Gæsluvarðhaldskröfur</Box>
          </Text>
          <thead>
            <tr>
              <th>
                <Text as="span" fontWeight="regular">
                  LÖKE málsnr.
                </Text>
              </th>
              <th>
                <Text as="span" fontWeight="regular">
                  Sakborningur
                </Text>
              </th>
              <th>
                <Text as="span" fontWeight="regular">
                  Krafa stofnuð
                </Text>
              </th>
              <th>
                <Text as="span" fontWeight="regular">
                  Staða
                </Text>
              </th>
              <th>
                <Text as="span" fontWeight="regular">
                  Gæsla rennur út
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c, i) => (
              <tr
                data-testid="detention-requests-table-row"
                role="button"
                key={i}
                className={styles.detentionRequestsTableRow}
                onClick={() => {
                  handleClick(c)
                }}
              >
                <td>
                  <Text as="span">{c.policeCaseNumber || '-'}</Text>
                </td>
                <td>
                  <Text as="span">
                    {c.accusedName || '-'}
                    {c.accusedNationalId && (
                      <Box marginLeft={1} component="span">
                        <Text as="span" variant="small" color="dark400">
                          {`(${
                            insertAt(
                              c.accusedNationalId.replace('-', ''),
                              '-',
                              6,
                            ) || '-'
                          })`}
                        </Text>
                      </Box>
                    )}
                  </Text>
                </td>
                <td>
                  <Text as="span">
                    {format(parseISO(c.created), 'PP', { locale: localeIS })}
                  </Text>
                </td>
                <td>
                  {c.state === CaseState.ACCEPTED &&
                  c.isCustodyEndDateInThePast ? (
                    <Tag variant="darkerBlue" outlined>
                      Gæsluvarðhaldi lokið
                    </Tag>
                  ) : (
                    <Tag
                      variant={mapCaseStateToTagVariant(c.state).color}
                      outlined
                    >
                      {mapCaseStateToTagVariant(c.state).text}
                    </Tag>
                  )}
                </td>
                <td>
                  <Text as="span">
                    {c.custodyEndDate && c.state === CaseState.ACCEPTED
                      ? `${formatDate(c.custodyEndDate, 'PP')}`
                      : null}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : error ? (
        <div
          className={styles.detentionRequestsError}
          data-testid="detention-requests-error"
        >
          <AlertMessage
            title="Ekki tókst að sækja gögn úr gagnagrunni"
            message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
            type="error"
          />
        </div>
      ) : loading ? (
        <Box className={styles.detentionRequestsTable}>
          <Loading />
        </Box>
      ) : null}
    </div>
  )
}

export default DetentionRequests
