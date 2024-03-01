import {
  Box,
  Button,
  Input,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { Modal, ModalProps } from '@island.is/react/components'

import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FormEvent, useContext, useMemo, useState } from 'react'
import { TypeCategoryContext } from '../../screens/CategoriesAndTypes/TypeCategoryContext'
import { useTypeAndCategoryMutation } from './useTypeAndCategoryMutation'

export const AddTypeCategory = ({
  isVisible,
  onClose,
}: Pick<ModalProps, 'isVisible' | 'onClose'>) => {
  const { formatMessage } = useLocale()
  const { activeTab, currentTypeCategory } = useContext(TypeCategoryContext)
  const [inputValue, setInputValue] = useState('')
  const [checked, setChecked] = useState(true)

  const { mutationFunction, isLoading } = useTypeAndCategoryMutation(activeTab)

  useMemo(() => {
    setInputValue(currentTypeCategory?.name ?? '')
    setChecked(!!currentTypeCategory?.active)
  }, [currentTypeCategory?.name, currentTypeCategory?.active])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutationFunction(
      {
        id: currentTypeCategory?.id,
        name: inputValue,
        active: checked,
      },
      formatMessage(m.saved),
      formatMessage(m.error),
    ).finally(() => onClose?.())
  }

  const labelCreate =
    activeTab === 'types'
      ? formatMessage(m.modalTitleType)
      : formatMessage(m.modalTitleCategory)
  const labelChange =
    activeTab === 'types'
      ? formatMessage(m.modalTitleTypeChange)
      : formatMessage(m.modalTitleCategoryChange)

  const isChange = typeof currentTypeCategory?.id === 'number'

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
      <form onSubmit={handleSubmit}>
        <Box paddingTop={3}>
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
              type="submit"
            >
              {formatMessage(m.save)}
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  )
}
