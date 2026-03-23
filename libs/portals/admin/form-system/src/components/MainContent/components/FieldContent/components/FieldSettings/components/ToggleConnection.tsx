import { m } from '@island.is/form-system/ui'
import {
  GridColumn as Column,
  GridRow as Row,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../../../../../lib/utils/interfaces'

export const ToggleConnection = () => {
  const { selectStatus, setSelectStatus, control } = useContext(ControlContext)
  const { isPublished } = control

  const { formatMessage } = useIntl()
  return (
    <Row>
      <Column>
        <ToggleSwitchCheckbox
          name="connect"
          label={formatMessage(m.connect)}
          checked={selectStatus === NavbarSelectStatus.NORMAL}
          disabled={isPublished}
          onChange={(e) =>
            setSelectStatus(
              e ? NavbarSelectStatus.NORMAL : NavbarSelectStatus.OFF,
            )
          }
        />
      </Column>
    </Row>
  )
}
