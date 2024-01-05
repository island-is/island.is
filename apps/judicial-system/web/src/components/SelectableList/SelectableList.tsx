import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'framer-motion'

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
  isLoading: boolean
  errorMessage?: string
  successMessage?: string
  warningMessage?: string
}

interface AnimateChildrenProps {
  id: string
}

const selectableListItemVariants = {
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
  hidden: { opacity: 0, y: 10 },
}
const AnimateChildren: React.FC<
  React.PropsWithChildren<AnimateChildrenProps>
> = (props) => {
  const { children, id } = props
  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ y: 0 }}
      exit={{ y: 10 }}
      key={id}
    >
      {children}
    </motion.div>
  )
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
  const [selectableItems, setSelectableItems] = useState<SelectableItem[]>([])
  const [isHandlingCTA, setIsHandlingCTA] = useState<boolean>()

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
  }, [items, isLoading])

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
            onChange={(evt) =>
              setSelectableItems((items) =>
                items?.map((item) => ({
                  ...item,
                  checked: evt.target.checked,
                })),
              )
            }
            disabled={isHandlingCTA || selectableItems.length === 0}
            strong
          />
        </Box>
        <AnimatePresence>
          {isLoading ? (
            <Box
              textAlign="center"
              paddingY={2}
              paddingX={3}
              marginBottom={2}
              key="loading-dots"
            >
              <LoadingDots />
            </Box>
          ) : errorMessage ? (
            <AnimateChildren id="error-message">
              <IconAndText
                icon="close"
                iconColor="red400"
                message={errorMessage}
              />
            </AnimateChildren>
          ) : warningMessage ? (
            <AnimateChildren id="warning-message">
              <IconAndText
                icon="warning"
                iconColor="yellow400"
                message={warningMessage}
              />
            </AnimateChildren>
          ) : !isLoading && successMessage ? (
            <AnimateChildren id="success-message">
              <IconAndText
                icon="checkmark"
                iconColor="blue400"
                message={successMessage}
              />
            </AnimateChildren>
          ) : (
            <ul>
              {selectableItems.map((item, index) => (
                <motion.li
                  custom={index}
                  initial={'hidden'}
                  animate={'visible'}
                  variants={selectableListItemVariants}
                  key={item.id}
                >
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
                      name={item.id}
                      value={item.name}
                      checked={item.checked}
                      onChange={(evt) =>
                        setSelectableItems((items) =>
                          items.map((i) =>
                            i.id === item.id
                              ? { ...i, checked: evt.target.checked }
                              : i,
                          ),
                        )
                      }
                      disabled={isHandlingCTA}
                    />
                  </Box>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </Box>
      <Box display="flex" justifyContent="flexEnd">
        <Button
          onClick={handleCTAButtonClick}
          loading={isHandlingCTA}
          disabled={
            items?.length === 0 ||
            isLoading ||
            selectableItems.every((p) => !p.checked)
          }
        >
          {CTAButton.label}
        </Button>
      </Box>
    </>
  )
}

export default SelectableList
