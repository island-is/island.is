import { FC } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import cn from 'classnames'

import { Checkbox } from '@island.is/island-ui/core'

import BlueBox from '../BlueBox/BlueBox'
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
}

const CheckboxList: FC<Props> = ({
  checkboxes,
  selected,
  onChange,
  fullWidth,
  blueBox = true,
  dataTestId = 'checkbox',
}: Props) => {
  const { formatMessage } = useIntl()

  const format = (value: string | MessageDescriptor) =>
    typeof value === 'string' ? value : formatMessage(value)

  const checkboxList = (
    <div
      className={cn(styles.checkboxGrid, {
        [styles.fullWidth]: fullWidth,
      })}
    >
      {checkboxes.map((checkbox) => (
        <div
          className={styles.checkboxItem}
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
        </div>
      ))}
    </div>
  )

  return blueBox ? <BlueBox>{checkboxList}</BlueBox> : checkboxList
}

export default CheckboxList
