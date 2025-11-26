import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'

import {
  Box,
  Button,
  Checkbox,
  Icon,
  LoadingDots,
} from '@island.is/island-ui/core'

import { IconAndText } from '../../routes/Prosecutor/components'
import { selectableList as strings } from './SelectableList.strings'
import * as styles from './SelectableList.css'

interface CTAButtonAttributes {
  onClick: (selectedListItems: Item[]) => Promise<void> | void
  label: string
}

export interface Item {
  id: string
  name: string
  invalid?: boolean
  tooltipText?: string
}

export interface SelectableItem extends Item {
  checked?: boolean
}

interface Props {
  selectAllText?: string
  items?: SelectableItem[]
  CTAButton?: CTAButtonAttributes
  isLoading: boolean
  errorMessage?: string
  successMessage?: string
  warningMessage?: string
  onChange?: (selectedItems: SelectableItem[]) => void
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
const AnimateChildren: FC<PropsWithChildren<AnimateChildrenProps>> = ({
  children,
  id,
}) => {
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

const SelectableList: FC<Props> = (props) => {
  const {
    selectAllText,
    items,
    CTAButton,
    isLoading,
    errorMessage,
    successMessage,
    warningMessage,
    onChange,
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
        ...item,
        checked:
          item.checked ??
          (selectableItems.find((i) => i.id === item.id)?.checked &&
            !item.invalid) ??
          false,
      })),
    )
  }, [items, isLoading])

  const handleCTAButtonClick = async () => {
    if (!CTAButton) {
      return
    }
    setIsHandlingCTA(true)
    await CTAButton.onClick(selectableItems.filter((p) => p.checked))
    setIsHandlingCTA(false)
  }

  const validSelectableItems = selectableItems.filter((item) => !item.invalid)
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
            label={
              selectAllText
                ? selectAllText
                : formatMessage(strings.selectAllLabel)
            }
            checked={
              validSelectableItems.length > 0 &&
              validSelectableItems.every((item) => item.checked)
            }
            onChange={(evt) => {
              const update = selectableItems.map((item) => ({
                ...item,
                checked: evt.target.checked && !item.invalid,
              }))
              setSelectableItems(update)
              if (onChange) {
                onChange(update)
              }
            }}
            disabled={isHandlingCTA || validSelectableItems.length === 0}
            strong
          />
        </Box>
        <AnimatePresence>
          {isLoading ? (
            <Box
              textAlign="center"
              paddingTop={1}
              paddingBottom={2}
              paddingX={3}
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
            <ul className={styles.grid}>
              {selectableItems.map((item, index) => (
                <motion.li
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={selectableListItemVariants}
                  key={item.id}
                >
                  <Box
                    key={item.id}
                    paddingX={3}
                    paddingY={2}
                    background={item.invalid ? 'red100' : 'blue100'}
                    borderRadius="standard"
                    display="flex"
                    justifyContent="spaceBetween"
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
                      tooltip={item.tooltipText}
                      onChange={(evt) => {
                        const update = selectableItems.map((i) =>
                          i.id === item.id
                            ? { ...i, checked: evt.target.checked }
                            : i,
                        )
                        setSelectableItems(update)
                        if (onChange) {
                          onChange(update)
                        }
                      }}
                      disabled={item.invalid || isHandlingCTA}
                    />
                    {item.invalid && (
                      <Box display="flex" alignItems="center">
                        <Icon
                          size="small"
                          type="outline"
                          color={'red300'}
                          icon={'warning'}
                        />
                      </Box>
                    )}
                  </Box>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </Box>
      {CTAButton && (
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
      )}
    </>
  )
}

export default SelectableList
