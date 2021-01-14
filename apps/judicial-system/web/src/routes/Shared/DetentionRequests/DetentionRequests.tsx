import React, { useEffect, useState, useContext, useMemo } from 'react'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import localeIS from 'date-fns/locale/is'
import cn from 'classnames'
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
  Icon,
} from '@island.is/island-ui/core'
import Loading from '../../../shared-components/Loading/Loading'
import {
  Case,
  CaseDecision,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'
import * as styles from './DetentionRequests.treat'
import { UserRole } from '@island.is/judicial-system/types'
import * as Constants from '../../../utils/constants'
import { Link } from 'react-router-dom'
import { formatDate } from '@island.is/judicial-system/formatters'
import { insertAt, parseTransition } from '../../../utils/formatters'
import { useMutation, useQuery } from '@apollo/client'
import { UserContext } from '../../../shared-components/UserProvider/UserProvider'
import { useHistory } from 'react-router-dom'
import { TransitionCaseMutation } from '../../../graphql'
import { CasesQuery } from '../../../utils/mutations'

type directionType = 'ascending' | 'descending'
interface SortConfig {
  key: keyof Case
  direction: directionType
}

// Credit for sorting solution: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
export const DetentionRequests: React.FC = () => {
  const [cases, setCases] = useState<Case[]>()
  const [sortConfig, setSortConfig] = useState<SortConfig>()

  // The index of requset that's about to be removed
  const [requestToRemoveIndex, setRequestToRemoveIndex] = useState<number>()

  const { user } = useContext(UserContext)
  const history = useHistory()

  const isJudge = user?.role === UserRole.JUDGE

  const { data, error, loading } = useQuery(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  const resCases = data?.cases

  useMemo(() => {
    const sortedCases = cases || []

    if (sortConfig) {
      sortedCases.sort((a: Case, b: Case) => {
        // Credit: https://stackoverflow.com/a/51169
        return sortConfig.direction === 'ascending'
          ? ('' + a[sortConfig.key]).localeCompare(
              b[sortConfig.key]?.toString() || '',
            )
          : ('' + b[sortConfig.key]).localeCompare(
              a[sortConfig.key]?.toString() || '',
            )
      })
    }
    return sortedCases
  }, [cases, sortConfig])

  useEffect(() => {
    document.title = 'Allar kröfur - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (resCases && !cases) {
      // Remove deleted cases
      const casesWithoutDeleted = resCases.filter((c: Case) => {
        return c.state !== CaseState.DELETED
      })

      if (isJudge) {
        const judgeCases = casesWithoutDeleted.filter((c: Case) => {
          // Judges should see all cases except cases with status code NEW.
          return c.state !== CaseState.NEW
        })

        setCases(judgeCases)
      } else {
        setCases(casesWithoutDeleted)
      }
    }
  }, [cases, isJudge, resCases, setCases])

  const mapCaseStateToTagVariant = (
    state: CaseState,
    decision?: CaseDecision,
    isCustodyEndDateInThePast?: boolean,
  ): { color: TagVariant; text: string } => {
    switch (state) {
      case CaseState.NEW:
      case CaseState.DRAFT:
        return { color: 'red', text: 'Drög' }
      case CaseState.SUBMITTED:
        return { color: 'purple', text: 'Krafa send' }
      case CaseState.RECEIVED:
        return { color: 'darkerMint', text: 'Krafa móttekin' }
      case CaseState.ACCEPTED:
        if (isCustodyEndDateInThePast) {
          return {
            color: 'darkerBlue',
            text:
              decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                ? 'Farbanni lokið'
                : 'Gæsluvarðhaldi lokið',
          }
        } else {
          return {
            color: 'blue',
            text:
              decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                ? 'Farbann virkt'
                : 'Gæsluvarðhald virkt',
          }
        }
      case CaseState.REJECTED:
        return { color: 'rose', text: 'Kröfu hafnað' }
      default:
        return { color: 'white', text: 'Óþekkt' }
    }
  }

  const handleClick = (c: Case): void => {
    if (c.state === CaseState.ACCEPTED || c.state === CaseState.REJECTED) {
      history.push(`${Constants.SIGNED_VERDICT_OVERVIEW}/${c.id}`)
    } else if (isJudge) {
      history.push(`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${c.id}`)
    } else if (c.state === CaseState.RECEIVED && c.isCourtDateInThePast) {
      history.push(`${Constants.STEP_FIVE_ROUTE}/${c.id}`)
    } else {
      history.push(`${Constants.SINGLE_REQUEST_BASE_ROUTE}/${c.id}`)
    }
  }

  const requestSort = (key: keyof Case) => {
    let d: directionType = 'ascending'

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      d = 'descending'
    }
    setSortConfig({ key, direction: d })
  }

  const getClassNamesFor = (name: keyof Case) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  const deleteCase = async (caseToDelete: Case) => {
    if (
      caseToDelete.state === CaseState.NEW ||
      caseToDelete.state === CaseState.DRAFT
    ) {
      const transitionRequest = parseTransition(
        caseToDelete.modified,
        CaseTransition.DELETE,
      )

      try {
        const { data } = await transitionCaseMutation({
          variables: { input: { id: caseToDelete.id, ...transitionRequest } },
        })
        if (!data) {
          return
        }

        setRequestToRemoveIndex(undefined)

        setTimeout(() => {
          setCases(
            cases?.filter((c: Case) => {
              return c !== caseToDelete
            }),
          )
        }, 800)

        clearTimeout()
      } catch (e) {
        console.log(e)
      }
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
        <>
          <Box marginBottom={3}>
            {/**
             * This should be a <caption> tag inside the table but
             * Safari has a bug that doesn't allow that. See more
             * https://stackoverflow.com/questions/49855899/solution-for-jumping-safari-table-caption
             */}
            <Text variant="h3" id="tableCaption">
              Gæsluvarðhaldskröfur
            </Text>
          </Box>
          <table
            className={styles.detentionRequestsTable}
            data-testid="detention-requests-table"
            aria-describedby="tableCation"
          >
            <thead className={styles.thead}>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  <Text as="span" fontWeight="regular">
                    LÖKE málsnr.
                  </Text>
                </th>
                <th className={styles.th}>
                  <Text as="span" fontWeight="regular">
                    <Box
                      component="button"
                      display="flex"
                      alignItems="center"
                      className={styles.thButton}
                      onClick={() => requestSort('accusedName')}
                    >
                      Sakborningur
                      <Box
                        className={cn(styles.sortIcon, {
                          [styles.sortAccusedNameAsc]:
                            getClassNamesFor('accusedName') === 'ascending',
                          [styles.sortAccusedNameDes]:
                            getClassNamesFor('accusedName') === 'descending',
                        })}
                        marginLeft={1}
                        component="span"
                        display="flex"
                        alignItems="center"
                      >
                        <Icon icon="caretDown" size="small" />
                      </Box>
                    </Box>
                  </Text>
                </th>
                <th className={styles.th}>
                  <Text as="span" fontWeight="regular">
                    <Box
                      component="button"
                      display="flex"
                      alignItems="center"
                      className={styles.thButton}
                      onClick={() => requestSort('created')}
                    >
                      Krafa stofnuð
                      <Box
                        className={cn(styles.sortIcon, {
                          [styles.sortCreatedAsc]:
                            getClassNamesFor('created') === 'ascending',
                          [styles.sortCreatedDes]:
                            getClassNamesFor('created') === 'descending',
                        })}
                        marginLeft={1}
                        component="span"
                        display="flex"
                        alignItems="center"
                      >
                        <Icon icon="caretUp" size="small" />
                      </Box>
                    </Box>
                  </Text>
                </th>
                <th className={styles.th}>
                  <Text as="span" fontWeight="regular">
                    Staða
                  </Text>
                </th>
                <th className={styles.th}>
                  <Text as="span" fontWeight="regular">
                    Gildir til
                  </Text>
                </th>
                <th></th>
                {!isJudge && <th></th>}
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => (
                <tr
                  key={i}
                  className={cn(
                    styles.tableRowContainer,
                    requestToRemoveIndex === i && 'isDeleting',
                  )}
                  data-testid="detention-requests-table-row"
                  role="button"
                  aria-label="Opna kröfu"
                  onClick={() => {
                    handleClick(c)
                  }}
                >
                  <td className={styles.td}>
                    <Text as="span">{c.policeCaseNumber || '-'}</Text>
                  </td>
                  <td className={cn(styles.td, 'flexDirectionCol')}>
                    <Text>{c.accusedName || '-'}</Text>
                    <Text>
                      {c.accusedNationalId && (
                        <Text as="span" variant="small" color="dark400">
                          {`(${
                            insertAt(
                              c.accusedNationalId.replace('-', ''),
                              '-',
                              6,
                            ) || '-'
                          })`}
                        </Text>
                      )}
                    </Text>
                  </td>
                  <td className={styles.td}>
                    <Text as="span">
                      {format(parseISO(c.created), 'PP', {
                        locale: localeIS,
                      })}
                    </Text>
                  </td>
                  <td className={styles.td}>
                    <Tag
                      variant={
                        mapCaseStateToTagVariant(
                          c.state,
                          c.decision,
                          c.isCustodyEndDateInThePast,
                        ).color
                      }
                      outlined
                    >
                      {
                        mapCaseStateToTagVariant(
                          c.state,
                          c.decision,
                          c.isCustodyEndDateInThePast,
                        ).text
                      }
                    </Tag>
                  </td>
                  <td className={styles.td}>
                    <Text as="span">
                      {c.custodyEndDate && c.state === CaseState.ACCEPTED
                        ? `${formatDate(c.custodyEndDate, 'PP')}`
                        : null}
                    </Text>
                  </td>
                  <td className={cn(styles.td, 'secondLast')}>
                    {!isJudge &&
                      (c.state === CaseState.DRAFT ||
                        c.state === CaseState.NEW) && (
                        <Box
                          component="button"
                          aria-label="Viltu eyða drögum?"
                          className={styles.deleteButton}
                          onClick={(evt) => {
                            evt.stopPropagation()
                            setRequestToRemoveIndex(
                              requestToRemoveIndex === i ? undefined : i,
                            )
                          }}
                        >
                          <Icon icon="close" color="blue400" />
                        </Box>
                      )}
                  </td>
                  <td
                    className={cn(
                      styles.deleteButtonContainer,
                      requestToRemoveIndex === i && 'open',
                    )}
                  >
                    <Button
                      colorScheme="destructive"
                      size="small"
                      onClick={(evt) => {
                        evt.stopPropagation()
                        deleteCase(cases[i])
                      }}
                    >
                      <Box as="span" className={styles.deleteButtonText}>
                        Eyða drögum
                      </Box>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
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
