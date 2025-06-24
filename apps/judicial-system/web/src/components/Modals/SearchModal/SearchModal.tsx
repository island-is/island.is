import { FC, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Box, Input, Tag, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatCaseType,
} from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system/types'

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
}

const SearchResultButton = ({ caseId, caseType, descriptor }: ResultsProps) => (
  <button
    className={styles.resultButton}
    onClick={() => {
      //TODO: Implement navigation to case route
      console.log(`Navigating to case route: ${caseId} - ${caseType}`)
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

const SearchModal: FC<Props> = ({ onClose }) => {
  const [searchString, setSearchString] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<JSX.Element | null>(null)

  const [searchCases] = useSearchCasesLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const handleSearch = async () => {
    setIsLoading(true)

    try {
      const results = await searchCases({
        variables: { input: { query: searchString } },
      })

      setSearchResults(
        <Box>
          {results.data?.searchCases.rows &&
            results.data.searchCases.rows.map((row) => (
              <SearchResultButton
                key={row.caseId}
                caseId={row.matchedValue}
                caseType={row.caseType}
                descriptor={row.matchedValue}
              />
            ))}
        </Box>,
      )
    } catch (error) {
      console.error('Error searching cases:', error)
    } finally {
      setIsLoading(false)
    }
  }
  console.log('Result', isLoading, searchResults)
  return (
    <ModalContainer title="Leit" onClose={onClose}>
      <Box margin={3} className={styles.searchModal}>
        <Text variant="h3" marginBottom={1}>
          Leit
        </Text>
        <Box marginBottom={4}>
          <Box marginBottom={3} columnGap={1} display="flex" flexWrap="wrap">
            <Tag outlined disabled>
              LÖKE málsnúmer
            </Tag>
            <Tag outlined disabled>
              Málsnúmer héraðsdóms
            </Tag>
            <Tag outlined disabled>
              Málsnúmer Landsréttar
            </Tag>
          </Box>
          <Input
            name="search"
            label="Málsnúmer"
            placeholder="S-1234/2025"
            value={searchString}
            onChange={(event) => setSearchString(event.target.value)}
            icon={{
              name: 'search',
              type: 'outline',
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch()
              }
            }}
            disabled={isLoading}
          />
        </Box>
        <AnimatePresence>
          {searchResults && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: 500 }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{
                opacity: { duration: 0.2 },
                maxHeight: { duration: 0.5, ease: 'easeOut' },
              }}
            >
              <div className={styles.searchResults}>
                <Text variant="eyebrow" color="dark300">
                  Leitarniðurstöður
                </Text>
                {searchResults}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </ModalContainer>
  )
}

export default SearchModal
