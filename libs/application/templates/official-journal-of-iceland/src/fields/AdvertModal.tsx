import {
  AlertMessage,
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
import { useAdvert } from '../hooks/useAdvert'
import debounce from 'lodash/debounce'
import set from 'lodash/set'
import { InputFields } from '../lib/types'
import { useFormContext } from 'react-hook-form'
type Props = {
  applicationId: string
  visible: boolean
  setVisible: (visible: boolean) => void
  onConfirmChange?: () => void
}

type UpdateAdvertFields = {
  title: string
  departmentId: string
  typeId: string
  html: string
  categories: string[]
}

export const AdvertModal = ({
  applicationId,
  visible,
  setVisible,
  onConfirmChange,
}: Props) => {
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [search, setSearch] = useState('')
  const [selectedAdvertId, setSelectedAdvertId] = useState<string | null>(null)

  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()
  const { application, updateApplication } = useApplication({
    applicationId,
  })

  const { adverts, paging, loading } = useAdverts({
    page: page,
    search: search,
  })

  const [updateAdvertFields, setUpdateAdvertFields] =
    useState<UpdateAdvertFields | null>(null)

  const { loading: loadingAdvert, error: advertError } = useAdvert({
    advertId: selectedAdvertId,
    onCompleted: (ad) => {
      setUpdateAdvertFields({
        title: ad.title,
        departmentId: ad.department.id,
        typeId: ad.type.id,
        html: ad.document.html,
        categories: ad.categories.map((c) => c.id),
      })
    },
  })

  const disableConfirmButton = !selectedAdvertId || !!advertError

  const onSelectAdvert = (advertId: string) => {
    setSelectedAdvertId(advertId)
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

  const onConfirm = () => {
    if (!updateAdvertFields) {
      return
    }

    const currentAnswers = structuredClone(application.answers)

    let updatedAnswers = set(
      currentAnswers,
      InputFields.advert.title,
      updateAdvertFields.title,
    )
    updatedAnswers = set(
      updatedAnswers,
      InputFields.advert.departmentId,
      updateAdvertFields.departmentId,
    )
    updatedAnswers = set(
      updatedAnswers,
      InputFields.advert.typeId,
      updateAdvertFields.typeId,
    )
    updatedAnswers = set(
      updatedAnswers,
      InputFields.advert.html,
      updateAdvertFields.html,
    )
    updatedAnswers = set(
      updatedAnswers,
      InputFields.advert.categories,
      updateAdvertFields.categories,
    )

    setValue(InputFields.advert.title, updateAdvertFields.title)
    setValue(InputFields.advert.departmentId, updateAdvertFields.departmentId)
    setValue(InputFields.advert.typeId, updateAdvertFields.typeId)
    setValue(InputFields.advert.html, updateAdvertFields.html)
    setValue(InputFields.advert.categories, updateAdvertFields.categories)

    updateApplication(updatedAnswers)
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
              {!!advertError && (
                <AlertMessage
                  type="error"
                  title={f(error.fetchAdvertFailed)}
                  message={f(error.fetchAdvertFailedMessage)}
                />
              )}
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
                        checked={selectedAdvertId === advert.id}
                        onChange={() => onSelectAdvert(advert.id)}
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
                disabled={disableConfirmButton}
                loading={loadingAdvert}
                onClick={onConfirm}
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
