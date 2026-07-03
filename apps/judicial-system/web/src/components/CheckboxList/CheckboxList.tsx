import { FC } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import cn from 'classnames'

import { Checkbox } from '@island.is/island-ui/core'

import * as styles from './CheckboxList.css'

export interface CheckboxInfo {
  title: MessageDescriptor
  id: string
  info: MessageDescriptor
}

interface Props {
  checkboxes: CheckboxInfo[]
  selected: string[] | undefined | null
  onChange: (id: string) => void
  fullWidth?: boolean
}

const CheckboxList: FC<Props> = ({
  checkboxes,
  selected,
  onChange,
  fullWidth,
}: Props) => {
  const { formatMessage } = useIntl()

  return (
    <div
      className={cn(styles.checkboxGrid, {
        [styles.fullWidth]: fullWidth,
      })}
    >
      {checkboxes.map((checkbox) => (
        <div data-testid="checkbox" key={checkbox.id}>
          <Checkbox
            name={formatMessage(checkbox.title)}
            label={formatMessage(checkbox.title)}
            value={checkbox.id}
            checked={Boolean(selected && selected.indexOf(checkbox.id) > -1)}
            tooltip={formatMessage(checkbox.info)}
            onChange={({ target }) => onChange(target.value)}
            large
            filled
          />
        </div>
      ))}
    </div>
  )
}

export default CheckboxList
