import {
  GridRow as Row,
  GridColumn as Column,
  ToggleSwitchCheckbox,
  Text,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { FormSystemField } from '@island.is/api/schema'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../../../../../lib/utils/interfaces'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'

export const ToggleConnection = () => {
  const { control, selectStatus, setSelectStatus } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField
  const currentItemDependency = control.form.dependencies?.find(
    (dep) => dep?.parentProp === currentItem.id,
  )
  const hasConnections =
    currentItemDependency !== undefined &&
    currentItemDependency?.childProps &&
    currentItemDependency.childProps.length > 0
  const { formatMessage } = useIntl()
  return (
    <Row>
      <Column>
        <ToggleSwitchCheckbox
          name="connect"
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
          <Text variant="eyebrow">{formatMessage(m.hasConnections)}</Text>
        </Column>
      )}
    </Row>
  )
}
