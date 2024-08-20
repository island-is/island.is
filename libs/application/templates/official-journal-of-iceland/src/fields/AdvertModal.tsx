import {
  Box,
  Button,
  Icon,
  Input,
  ModalBase,
  Pagination,
  RadioButton,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './Advert.css'
import { useLocale } from '@island.is/localization'
import { advert, error, general } from '../lib/messages'
import { useQuery } from '@apollo/client'
import { ADVERTS_QUERY } from '../graphql/queries'
import debounce from 'lodash/debounce'
import { DEBOUNCE_INPUT_TIMER } from '../lib/constants'
import { ChangeEvent, ReactNode, useState } from 'react'
import { OfficialJournalOfIcelandGraphqlResponse } from '../lib/types'
type Props = {
  visible: boolean
  setVisibility: (visibility: boolean) => void
  setSelectedAdvertId: React.Dispatch<React.SetStateAction<string | null>>
}
export const AdvertModal = ({
  visible,
  setVisibility,
  setSelectedAdvertId,
}: Props) => {
  const { formatMessage: f } = useLocale()

  const [localSelectedAdvertId, setLocalSelectedAdvertId] = useState<
    string | null
  >(null)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const updateSearch = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSearch(e.target.value)
  }

  const { data, loading } = useQuery<
    OfficialJournalOfIcelandGraphqlResponse<'adverts'>
  >(ADVERTS_QUERY, {
    variables: { input: { page: page, search: search, pageSize: 10 } },
  })

  const debouncedSearch = debounce(updateSearch, DEBOUNCE_INPUT_TIMER)

  return (
    <ModalBase
      baseId="advertModal"
      isVisible={visible}
      className={styles.modalBase}
      onVisibilityChange={(visibility) => {
        if (!visibility) {
          setSearch('')
          setVisibility(visibility)
        }
      }}
    >
      {({ closeModal }) => (
        <Box className={styles.modalContainer} background="white" padding={4}>
          <Box className={styles.modal}>
            <Box display="flex" justifyContent="flexEnd">
              <button onClick={closeModal}>
                <Icon size="large" icon="close" />
              </button>
            </Box>
            <Box className={styles.contentWrapper}>
              <Text variant="h1">{f(advert.modal.title)}</Text>
              <Box width="half">
                <Input
                  size="sm"
                  name="modal-search"
                  backgroundColor="blue"
                  placeholder={f(advert.modal.search)}
                  onChange={debouncedSearch}
                />
              </Box>
              {data?.officialJournalOfIcelandAdverts.adverts.length ? (
                <Box
                  paddingY={1}
                  borderColor="blue200"
                  borderTopWidth="standard"
                  borderBottomWidth="standard"
                >
                  <Stack space={2} dividers="regular">
                    {data.officialJournalOfIcelandAdverts.adverts.map(
                      (advert, i) => (
                        <RadioButton
                          name={advert.id}
                          key={i}
                          label={advert.title}
                          checked={localSelectedAdvertId === advert.id}
                          onChange={() => setLocalSelectedAdvertId(advert.id)}
                        />
                      ),
                    )}
                  </Stack>
                </Box>
              ) : loading ? (
                <SkeletonLoader height={80} repeat={3} space={2} />
              ) : (
                <Text>{f(error.noResults)}</Text>
              )}
            </Box>
            <Box>
              <Pagination
                page={page}
                totalPages={
                  data?.officialJournalOfIcelandAdverts.paging.totalPages
                }
                renderLink={(page, className, children) => (
                  <Box
                    cursor="pointer"
                    className={className}
                    onClick={() => setPage(page)}
                  >
                    {children}
                  </Box>
                )}
              />
            </Box>
            <Box className={styles.buttonWrapper}>
              <Button onClick={closeModal} variant="ghost">
                {f(general.cancel)}
              </Button>
              <Button
                onClick={() => {
                  setSelectedAdvertId(localSelectedAdvertId)
                  setLocalSelectedAdvertId(null)
                  setSearch('')
                  setVisibility(false)
                }}
              >
                {f(general.confirm)}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </ModalBase>
  )
}
