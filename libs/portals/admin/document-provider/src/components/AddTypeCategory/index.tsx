import {
  Box,
  Button,
  Input,
  Text,
  ToggleSwitchButton,
  toast,
} from '@island.is/island-ui/core'
import { Modal, ModalProps } from '@island.is/react/components'

import { Form } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useContext, useEffect, useMemo, useState } from 'react'
import { usePutDocumentProvidedCategoryMutation } from './MutateTypeCategory.generated'
import { TypeCategoryContext } from '../../screens/CategoriesAndTypes/TypeCategoryContext'

export const AddTypeCategory = ({
  isVisible,
  onClose,
}: Pick<ModalProps, 'isVisible' | 'onClose'>) => {
  const { formatMessage } = useLocale()
  const { activeTab, currentTypeCategory } = useContext(TypeCategoryContext)
  const [inputValue, setInputValue] = useState('')
  const [checked, setChecked] = useState(true)
  const [putCategory, { loading }] = usePutDocumentProvidedCategoryMutation()

  useMemo(() => {
    setInputValue(currentTypeCategory?.name ?? '')
    setChecked(!!currentTypeCategory?.active)
  }, [currentTypeCategory?.name, currentTypeCategory?.active])

  const handleSubmit = async () => {
    const payload = {
      variables: {
        input: {
          categoryId: 1,
        },
      },
      onCompleted: () => {
        toast.success(formatMessage(m.saved))
      },
      onError: () => {
        toast.success('Error')
      },
    }

    putCategory(payload)
    onClose?.()
  }

  const isLoading = loading
  const labelCreate =
    activeTab === 'types'
      ? formatMessage(m.modalTitleType)
      : formatMessage(m.modalTitleCategory)
  const labelChange =
    activeTab === 'types'
      ? formatMessage(m.modalTitleTypeChange)
      : formatMessage(m.modalTitleCategoryChange)

  const isChange = !!currentTypeCategory?.id

  return (
    <Modal
      id="add-type-or-category"
      isVisible={isVisible}
      title={isChange ? labelChange : labelCreate}
      label={isChange ? labelChange : labelCreate}
      onClose={() => {
        onClose?.()
        setInputValue('')
      }}
      closeButtonLabel={formatMessage(m.close)}
    >
      <Form method="post">
        <Box paddingTop={3}>
          {/* <Text>Some title</Text> */}
          <Input
            name="type-or-category"
            backgroundColor="blue"
            size="sm"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
            }}
            label={formatMessage(m.name)}
            type="text"
            rows={12}
          />
          <Box paddingTop={2}>
            <ToggleSwitchButton
              checked={checked}
              label="Óvirkur / virkur"
              onChange={setChecked}
            />
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flexEnd"
            columnGap={3}
            paddingTop={7}
          >
            <Button onClick={onClose} size="small" variant="ghost">
              {formatMessage(m.cancel)}
            </Button>
            <Button
              loading={isLoading}
              size="small"
              icon="checkmark"
              onClick={handleSubmit}
            >
              {formatMessage(m.save)}
            </Button>
          </Box>
        </Box>
      </Form>
    </Modal>
  )
}
