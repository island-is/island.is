import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Checkbox, LoadingDots } from '@island.is/island-ui/core'

import { IconAndText } from '../../routes/Prosecutor/components'
import { selectableList as strings } from './SelectableList.strings'

interface CTAButtonAttributes {
  onClick: (selectedListItems: Item[]) => Promise<void> | void
  label: string
}

export interface Item {
  id: string
  name: string
}

interface SelectableItem extends Item {
  checked: boolean
}

interface Props {
  items?: Item[]
  CTAButton: CTAButtonAttributes
  isLoading?: boolean
  errorMessage?: string
  successMessage?: string
  warningMessage?: string
}

const SelectableList: React.FC<Props> = (props) => {
  const {
    items,
    CTAButton,
    isLoading,
    errorMessage,
    successMessage,
    warningMessage,
  } = props
  const { formatMessage } = useIntl()
  const [selectableItems, setSelectableItems] = React.useState<
    SelectableItem[]
  >([])
  const [isHandlingCTA, setIsHandlingCTA] = React.useState<boolean>()

  useEffect(() => {
    if (!items) {
      return
    }

    setSelectableItems((selectableItems) =>
      items.map((item) => ({
        id: item.id,
        name: item.name,
        checked:
          selectableItems.find((i) => i.id === item.id)?.checked ?? false,
      })),
    )
  }, [items])

  const handleCTAButtonClick = async () => {
    setIsHandlingCTA(true)
    await CTAButton.onClick(selectableItems.filter((p) => p.checked))
    setIsHandlingCTA(false)
  }

  return (
    <>
      <Box
        marginBottom={3}
        borderColor="blue200"
        borderWidth="standard"
        paddingX={4}
        paddingY={3}
        borderRadius="standard"
      >
        <Box marginBottom={2}>
          <Checkbox
            name="select-all"
            label={formatMessage(strings.selectAllLabel)}
            checked={
              selectableItems.length > 0 &&
              selectableItems.every((item) => item.checked === true)
            }
            onChange={() =>
              setSelectableItems((items) =>
                items?.map((item) => ({ ...item, checked: !item.checked })),
              )
            }
            disabled={isHandlingCTA || selectableItems.length === 0}
            strong
          />
        </Box>
        {isLoading ? (
          <Box textAlign="center" paddingY={2} paddingX={3} marginBottom={2}>
            <LoadingDots />
          </Box>
        ) : errorMessage ? (
          <IconAndText icon="close" iconColor="red400" message={errorMessage} />
        ) : warningMessage ? (
          <IconAndText
            icon="warning"
            iconColor="yellow400"
            message={warningMessage}
          />
        ) : items && selectableItems.length === 0 && successMessage ? (
          <IconAndText
            icon="checkmark"
            iconColor="blue400"
            message={successMessage}
          />
        ) : (
          selectableItems.map((item, index) => (
            <Box
              key={item.id}
              marginBottom={index === selectableItems.length - 1 ? 0 : 2}
              paddingX={3}
              paddingY={2}
              background="blue100"
              borderRadius="standard"
            >
              <Checkbox
                label={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="spaceBetween"
                  >
                    {item.name}
                    {isHandlingCTA && item.checked && <LoadingDots />}
                  </Box>
                }
                name={item.name}
                value={item.name}
                checked={item.checked}
                onChange={(evt) =>
                  setSelectableItems((items) => {
                    const index = items.findIndex((i) => i.name === item.name)
                    const newItems = [...items]
                    newItems[index].checked = evt.target.checked
                    return newItems
                  })
                }
                disabled={isHandlingCTA}
              />
            </Box>
          ))
        )}
      </Box>
      <Box display="flex" justifyContent="flexEnd">
        <Button
          onClick={handleCTAButtonClick}
          loading={isHandlingCTA}
          disabled={selectableItems.every((p) => !p.checked)}
        >
          {CTAButton.label}
        </Button>
      </Box>
    </>
  )
}

export default SelectableList
