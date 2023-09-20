import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Checkbox, LoadingDots } from '@island.is/island-ui/core'

import { selectableList as strings } from './SelectableList.strings'

interface CTAButtonAttributes {
  onClick: (selectedListItems: Item[]) => Promise<void>
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
  items: Item[]
  CTAButton: CTAButtonAttributes
}

const SelectableList: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { items, CTAButton, children } = props
  const { formatMessage } = useIntl()
  const [selectableItems, setSelectableItems] = React.useState<
    SelectableItem[]
  >([])
  const [isLoading, setIsLoading] = React.useState<boolean>()

  useEffect(() => {
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
    setIsLoading(true)
    await CTAButton.onClick(selectableItems.filter((p) => p.checked))
    setIsLoading(false)
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
                items.map((item) => ({ ...item, checked: !item.checked })),
              )
            }
            disabled={isLoading || selectableItems.length === 0}
            strong
          />
        </Box>
        {selectableItems.length > 0
          ? selectableItems.map((item, index) => (
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
                      {isLoading && item.checked && <LoadingDots />}
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
                  disabled={isLoading}
                />
              </Box>
            ))
          : children}
      </Box>
      <Box display="flex" justifyContent="flexEnd">
        <Button
          onClick={handleCTAButtonClick}
          loading={isLoading}
          disabled={selectableItems.every((p) => !p.checked)}
        >
          {CTAButton.label}
        </Button>
      </Box>
    </>
  )
}

export default SelectableList
