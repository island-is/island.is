import { FC, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Box, Input, Tag, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatCaseType,
} from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system/types'
import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'

import { ModalContainer } from '../Modal/Modal'
import { useSearchCasesLazyQuery } from './searchCases.generated'
import * as styles from './SearchModal.css'

interface Props {
  onClose: () => void
}

interface ResultsProps {
  caseId: string
  caseType: CaseType
  descriptor: string
  onClick: () => void
}

const SearchResultButton: FC<ResultsProps> = ({
  caseId,
  caseType,
  descriptor,
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
      <Box
        border="standard"
        padding={2}
        borderRadius="large"
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
      >
        <Box display="flex" alignItems="flexStart" flexDirection={'column'}>
          <Text variant="eyebrow">{capitalize(formatCaseType(caseType))}</Text>
          <Text variant="h3" as="p" fontWeight="light">
            {descriptor}
          </Text>
        </Box>
      </Box>
    </button>
  )
}

const SearchModal: FC<Props> = ({ onClose }) => {
  const [searchString, setSearchString] = useState<string>('')

  const [searchResults, setSearchResults] =
    useState<[JSX.Element[], number | undefined]>()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [searchCases] = useSearchCasesLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const results = await searchCases({
          variables: { input: { query: searchString } },
        })

        setSearchResults([
          results.data && results.data.searchCases.rowCount > 0
            ? results.data?.searchCases.rows.map((row, idx) => (
                <SearchResultButton
                  key={idx}
                  caseId={row.caseId}
                  caseType={row.caseType}
                  descriptor={`${row.matchedValue}${
                    row.matchedField === 'defendantName'
                      ? ''
                      : ` - ${row.defendantName}`
                  }`}
                  onClick={onClose}
                />
              ))
            : [
                <Text
                  key="no-results"
                  variant="small"
                >{`Engar niðurstöður fundust fyrir: ${searchString}`}</Text>,
              ],
          results.data?.searchCases.rowCount,
        ])
      } catch (error) {
        console.error('Error searching cases:', error)
      }
    }

    if (searchString.trim().length > 0) {
      handleSearch()
    } else {
      setSearchResults(undefined)
    }
  }, [onClose, searchCases, searchString])

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
              className={styles.searchResultsContainer}
              transition={{
                opacity: { duration: 0.2 },
                maxHeight: { duration: 0.5, ease: 'easeOut' },
              }}
            >
              <div className={styles.searchResults}>
                <Text variant="eyebrow" color="dark300">
                  {`Leitarniðurstöður (${searchResults[1]})`}
                </Text>
                {searchResults[0]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalContainer>
  )
}

export default SearchModal
