import { FC, useContext, useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import cn from 'classnames'
import { AnimatePresence, motion } from 'motion/react'

import { Box, Input, Tag, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatCaseType,
} from '@island.is/judicial-system/formatters'
import {
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  CaseType,
  SearchCasesRow,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { UserContext } from '../../UserProvider/UserProvider'
import { ModalContainer } from '../Modal/Modal'
import { useSearchCasesLazyQuery } from './searchCases.generated'
import * as styles from './SearchModal.css'

const SEARCH_DEBOUNCE_MS = 300

type SearchResultsState =
  | {
      rows: SearchCasesRow[]
      rowCount: number
      query: string
    }
  | undefined

interface Props {
  onClose: () => void
}

interface ResultsProps {
  caseId: string
  caseType: CaseType
  descriptor: string
  caseNumber?: string | null
  onClick: () => void
}

const SearchResultButton: FC<ResultsProps> = ({
  caseId,
  caseType,
  descriptor,
  caseNumber,
  onClick,
}: ResultsProps) => {
  const { handleOpenCase } = useCaseList()

  return (
    <button
      className={styles.resultButton}
      onClick={() => {
        handleOpenCase(caseId)
        onClick()
      }}
    >
      <Box border="standard" padding={2} borderRadius="large">
        <Box display="flex" alignItems="flexStart" flexDirection="column">
          <Text variant="eyebrow">{capitalize(formatCaseType(caseType))}</Text>
          <Text variant="h3" as="p" fontWeight="light" textAlign="left">
            {descriptor}
          </Text>
          {caseNumber && (
            <Text variant="small" color="dark300">
              {`Málsnúmer: ${caseNumber}`}
            </Text>
          )}
        </Box>
      </Box>
    </button>
  )
}

const SearchModal: FC<Props> = ({ onClose }) => {
  const { handleOpenCase } = useCaseList()
  const { user } = useContext(UserContext)

  const [searchString, setSearchString] = useState<string>('')
  const [debouncedQuery, setDebouncedQuery] = useState<string>('')
  const [focusIndex, setFocusIndex] = useState<number>(-1)
  const [searchResults, setSearchResults] = useState<SearchResultsState>()

  const searchInputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const focusIndexRef = useRef(focusIndex)
  const searchResultsRef = useRef(searchResults)

  focusIndexRef.current = focusIndex
  searchResultsRef.current = searchResults

  const [searchCases] = useSearchCasesLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (searchString.trim() === '') {
      setDebouncedQuery('')
    }
  }, [searchString])

  useDebounce(
    () => {
      const trimmed = searchString.trim()
      if (trimmed) setDebouncedQuery(trimmed)
    },
    SEARCH_DEBOUNCE_MS,
    [searchString],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const results = searchResultsRef.current
      const idx = focusIndexRef.current
      if (!results || results.rowCount === 0) return

      const { rows } = results
      const len = rows.length

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusIndex((prev) => (prev < 0 ? 0 : (prev + 1) % len))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusIndex((prev) => (prev < 0 ? len - 1 : (prev - 1 + len) % len))
      }

      if (e.key === 'Enter' && idx >= 0) {
        const row = rows[idx]
        if (row?.caseId) {
          handleOpenCase(row.caseId)
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleOpenCase, onClose])

  useEffect(() => {
    if (focusIndex >= 0 && itemRefs.current[focusIndex]) {
      itemRefs.current[focusIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [focusIndex])

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (debouncedQuery === '') {
      setSearchResults(undefined)
      setFocusIndex(-1)
      return
    }

    let cancelled = false

    const runSearch = async () => {
      try {
        const results = await searchCases({
          variables: { input: { query: debouncedQuery } },
        })

        if (cancelled) return

        const data = results.data?.searchCases
        const rowCount = data?.rowCount ?? 0
        const rows = data?.rows ?? []

        setSearchResults({ rows, rowCount, query: debouncedQuery })
        setFocusIndex(-1)
      } catch (error) {
        if (!cancelled) {
          console.error('Error searching cases:', error)
        }
      }
    }

    runSearch()
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, searchCases, user])

  return (
    <ModalContainer title="Leit" onClose={onClose} position="top">
      <div className={styles.searchModal}>
        <Text variant="h3" marginBottom={1}>
          Leit
        </Text>
        <Box marginBottom={3} columnGap={1} display="flex" flexWrap="wrap">
          <Tag outlined disabled>
            Málsnúmer
          </Tag>
          <Tag outlined disabled>
            Kennitala varnaraðila
          </Tag>
          <Tag outlined disabled>
            Nafn varnaraðila
          </Tag>
        </Box>
        <Input
          ref={searchInputRef}
          name="search"
          label="Leitarorð"
          placeholder="Leit í málalistum"
          value={searchString}
          onChange={(event) => setSearchString(event.target.value)}
          autoComplete="off"
          icon={{
            name: 'search',
            type: 'outline',
          }}
        />
        <AnimatePresence>
          {searchResults && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0, marginTop: '32px' }}
              animate={{ opacity: 1, maxHeight: 500, marginTop: '32px' }}
              exit={{ opacity: 0, maxHeight: 0, marginTop: 0 }}
              className={cn(styles.searchResultsContainer)}
              transition={{
                opacity: { duration: 0.2 },
                maxHeight: { duration: 0.5, ease: 'easeOut' },
              }}
            >
              <div className={grid({ gap: 2 })}>
                <Text variant="eyebrow" color="dark300">
                  {`Leitarniðurstöður (${searchResults.rowCount})`}
                </Text>
                <ul className={grid({ gap: 2 })}>
                  {searchResults.rowCount > 0 ? (
                    searchResults.rows.map((row, index) => {
                      const caseNumber = user
                        ? isProsecutionUser(user)
                          ? row.policeCaseNumbers[0]
                          : isDistrictCourtUser(user)
                          ? row.courtCaseNumber
                          : isCourtOfAppealsUser(user)
                          ? row.appealCaseNumber
                          : undefined
                        : undefined
                      return (
                        <li
                          key={`${row.caseId}-${index}`}
                          className={cn({
                            [styles.focus]: focusIndex === index,
                          })}
                          ref={(el) => {
                            itemRefs.current[index] = el
                          }}
                        >
                          <SearchResultButton
                            caseId={row.caseId}
                            caseType={row.caseType}
                            caseNumber={caseNumber}
                            descriptor={`${row.matchedValue}${
                              row.matchedField === 'defendantName' ||
                              !row.defendantName
                                ? ''
                                : ` - ${row.defendantName}`
                            }`}
                            onClick={onClose}
                          />
                        </li>
                      )
                    })
                  ) : (
                    <li>
                      <Text variant="small">
                        {`Engar niðurstöður fundust fyrir: ${searchResults.query}`}
                      </Text>
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalContainer>
  )
}

export default SearchModal
