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
import { useApplication } from '../hooks/useUpdateApplication'
import { useAdverts } from '../hooks/useAdverts'
import { useState } from 'react'
import {
  DEBOUNCE_INPUT_TIMER,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  OJOI_INPUT_HEIGHT,
} from '../lib/constants'
import debounce from 'lodash/debounce'
import { InputFields } from '../lib/types'
import { useFormContext } from 'react-hook-form'
import { OfficialJournalOfIcelandAdvert } from '@island.is/api/schema'
import { cleanTypename } from '../lib/utils'
type Props = {
  applicationId: string
  visible: boolean
  setVisible: (visible: boolean) => void
  onConfirmChange?: () => void
}

export const AdvertModal = ({
  applicationId,
  visible,
  setVisible,
  onConfirmChange,
}: Props) => {
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()
  const { application, updateApplication } = useApplication({
    applicationId,
  })

  const [page, setPage] = useState(DEFAULT_PAGE)
  const [search, setSearch] = useState('')
  const [selectedAdvert, setSelectedAdvert] =
    useState<OfficialJournalOfIcelandAdvert | null>(null)

  const { adverts, paging, loading } = useAdverts({
    page: page,
    search: search,
  })

  const onSelectAdvert = (advert: OfficialJournalOfIcelandAdvert) => {
    setSelectedAdvert(advert)
  }

  const onSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    debouncedSearch.cancel()
    debouncedSearch(e.target.value)
  }

  const onConfirm = (advert: OfficialJournalOfIcelandAdvert | null) => {
    if (!advert) {
      return
    }

    const department = cleanTypename(advert.department)
    const type = cleanTypename(advert.type)

    const categories = advert.categories.map((category) =>
      cleanTypename(category),
    )

    setValue(InputFields.advert.department, department)
    setValue(InputFields.advert.type, type)
    setValue(InputFields.advert.title, advert.title)

    updateApplication({
      ...application.answers,
      advert: {
        department,
        type,
        categories,
        title: advert.title,
        html: Buffer.from(advert.document.html).toString('base64'),
      },
    })

    onConfirmChange && onConfirmChange()
    setVisible(false)
  }

  const debouncedSearch = debounce(onSearchChange, DEBOUNCE_INPUT_TIMER)

  return (
    <ModalBase
      baseId="advertModal"
      className={styles.modalBase}
      isVisible={visible}
      onVisibilityChange={(isVisible) => {
        if (!isVisible) {
          setVisible(false)
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
                  onChange={handleSearchChange}
                />
              </Box>
              <Box
                paddingY={1}
                borderColor="blue200"
                borderTopWidth="standard"
                borderBottomWidth="standard"
              >
                {loading && (
                  <SkeletonLoader
                    repeat={DEFAULT_PAGE_SIZE}
                    height={OJOI_INPUT_HEIGHT}
                    space={1}
                    borderRadius="standard"
                  />
                )}
                {adverts?.length !== 0 ? (
                  <Stack space={2} dividers="regular">
                    {adverts?.map((advert, i) => (
                      <RadioButton
                        key={i}
                        name={advert.id}
                        label={advert.title}
                        checked={selectedAdvert?.id === advert.id}
                        onChange={() => onSelectAdvert(advert)}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Box paddingY={2}>
                    <Text>{f(error.noResults)}</Text>
                  </Box>
                )}
              </Box>
            </Box>
            <Box>
              <Pagination
                page={page}
                totalPages={paging?.totalPages}
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
                disabled={!selectedAdvert}
                onClick={() => onConfirm(selectedAdvert)}
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
