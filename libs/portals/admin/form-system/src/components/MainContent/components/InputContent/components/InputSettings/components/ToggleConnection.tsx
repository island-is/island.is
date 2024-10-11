import {
  GridRow as Row,
  GridColumn as Column,
  ToggleSwitchCheckbox,
  Text,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { FormSystemInput } from '@island.is/api/schema'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../../../../../lib/utils/interfaces'
import { useIntl } from 'react-intl'
import { m } from '../../../../../../../lib/messages'

export const ToggleConnection = () => {
  const { control, selectStatus, setSelectStatus } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemInput
  const hasConnections =
    control.form.dependencies[currentItem.guid as string] !== undefined &&
    control.form.dependencies[currentItem.guid as string].length > 0
  const { formatMessage } = useIntl()
  return (
    <Row>
      <Column>
        <ToggleSwitchCheckbox
          name="Tengja"
          label={formatMessage(m.connect)}
          checked={selectStatus === NavbarSelectStatus.NORMAL}
          onChange={(e) =>
            setSelectStatus(
              e ? NavbarSelectStatus.NORMAL : NavbarSelectStatus.OFF,
            )
          }
        />
      </Column>
      {hasConnections && (
        <Column>
          <Text variant="eyebrow"> Hefur tengingar</Text>
        </Column>
      )}
    </Row>
  )
}
