import type { FC } from 'react'
import type { MessageDescriptor } from 'react-intl'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { motion } from 'motion/react'

import { Checkbox } from '@island.is/island-ui/core'
import BlueBox from '@island.is/judicial-system-web/src/components/BlueBox/BlueBox'

import * as styles from './CheckboxList.css'

export interface CheckboxInfo {
  title: string | MessageDescriptor
  id: string
  info?: string | MessageDescriptor
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

interface Props {
  checkboxes: CheckboxInfo[]
  selected?: string[] | null
  onChange?: (id: string) => void
  fullWidth?: boolean
  blueBox?: boolean
  dataTestId?: string
  stagger?: boolean
}

const staggerContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

const CheckboxList: FC<Props> = ({
  checkboxes,
  selected,
  onChange,
  fullWidth,
  blueBox = true,
  dataTestId = 'checkbox',
  stagger = false,
}: Props) => {
  const { formatMessage } = useIntl()

  const format = (value: string | MessageDescriptor) =>
    typeof value === 'string' ? value : formatMessage(value)

  const checkboxList = (
    <motion.div
      className={cn(styles.checkboxGrid, {
        [styles.fullWidth]: fullWidth,
      })}
      variants={stagger ? staggerContainerVariants : undefined}
      initial={stagger ? 'hidden' : false}
      animate={stagger ? 'visible' : undefined}
    >
      {checkboxes.map((checkbox) => (
        <motion.div
          className={styles.checkboxItem}
          variants={stagger ? staggerItemVariants : undefined}
          data-testid={dataTestId}
          key={checkbox.id}
        >
          <Checkbox
            id={checkbox.id}
            name={format(checkbox.title)}
            label={format(checkbox.title)}
            value={checkbox.id}
            checked={
              checkbox.checked ??
              Boolean(selected && selected.indexOf(checkbox.id) > -1)
            }
            tooltip={checkbox.info ? format(checkbox.info) : undefined}
            onChange={({ target }) =>
              checkbox.onChange
                ? checkbox.onChange(target.checked)
                : onChange?.(target.value)
            }
            disabled={checkbox.disabled}
            large
            filled
          />
        </motion.div>
      ))}
    </motion.div>
  )

  return blueBox ? <BlueBox>{checkboxList}</BlueBox> : checkboxList
}

export default CheckboxList
