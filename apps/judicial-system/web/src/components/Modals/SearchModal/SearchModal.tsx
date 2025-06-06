import { FC, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import {
  Box,
  Input,
  SkeletonLoader,
  Tag,
  Text,
} from '@island.is/island-ui/core'

import { ModalContainer } from '../Modal/Modal'
import * as styles from './SearchModal.css'

interface Props {
  onClose: () => void
}

const SearchResultButton = () => (
  <button className={styles.resultButton}>
    <Box
      border="standard"
      padding={2}
      borderRadius="large"
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      width="full"
      marginBottom={2}
    >
      <Box display="flex" alignItems="flexStart" flexDirection={'column'}>
        <Text variant="eyebrow">Gæsluvarðhald</Text>
        <Text variant="h3" as="p" fontWeight="light">
          S-1234/2025
        </Text>
      </Box>
      <Tag outlined disabled>
        Virkt
      </Tag>
    </Box>
  </button>
)

const SearchModal: FC<Props> = ({ onClose }) => {
  const [searchString, setSearch] = useState<string>('')

  const [isSearching, setIsSearching] = useState<boolean>(false)

  const isLoading = false

  return (
    <ModalContainer title="Leit" onClose={onClose}>
      <Box margin={3}>
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
            onChange={(event) => setSearch(event.target.value)}
            icon={{
              name: 'search',
              type: 'outline',
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setIsSearching(true)
              }
            }}
            onBlur={() => {
              setIsSearching(false)
            }}
          />
        </Box>
        <AnimatePresence>
          {isSearching && (
            <motion.div
            //   initial={{ opacity: 0, maxHeight: 0 }}
            //   animate={{ opacity: 1, maxHeight: 500 }}
            //   exit={{ opacity: 0, maxHeight: 0 }}
            //   transition={{ duration: 0.2 }}
            >
              <Text variant="eyebrow" marginBottom={2} color="dark300">
                Leitarniðurstöður
              </Text>

              {isLoading ? (
                <SkeletonLoader repeat={3} height={90} space={2} />
              ) : (
                <>
                  <SearchResultButton />
                  <SearchResultButton />
                  <SearchResultButton />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </ModalContainer>
  )
}

export default SearchModal
