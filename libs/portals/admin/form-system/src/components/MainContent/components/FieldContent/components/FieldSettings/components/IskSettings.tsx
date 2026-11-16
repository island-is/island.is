import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn as Column,
  GridRow as Row,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { useContext, useEffect } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../../../../../lib/utils/interfaces'
import * as styles from '../../../../../MainContent.css'

export const IskSettings = () => {
  const { control, selectStatus, setSelectStatus, setOpenComponents } =
    useContext(ControlContext)
  const { activeItem, form, isReadOnly } = control
  const currentItem = activeItem.data as FormSystemField

  useEffect(
    () => () => setSelectStatus(NavbarSelectStatus.OFF),
    [currentItem.id, setSelectStatus],
  )

  return (
    <Row marginTop={2}>
      <Column>
        <ToggleSwitchCheckbox
          className={styles.identifierToggle}
          name="fieldsToSum"
          label="Velja reiti í samtölu. Ef enginn reitur er valinn munu allir krónutölureitir á skjánum teljast með í samtöluna"
          checked={selectStatus === NavbarSelectStatus.SUM_FIELDS}
          disabled={isReadOnly}
          onChange={(checked) => {
            setSelectStatus(
              checked ? NavbarSelectStatus.SUM_FIELDS : NavbarSelectStatus.OFF,
            )
            const screen = form.screens?.find(
              (screen) => screen?.id === currentItem.screenId,
            )
            if (checked && screen) {
              setOpenComponents((previous) => ({
                sections:
                  screen.sectionId &&
                  !previous.sections.includes(screen.sectionId)
                    ? [...previous.sections, screen.sectionId]
                    : previous.sections,
                screens: previous.screens.includes(screen.id)
                  ? previous.screens
                  : [...previous.screens, screen.id],
              }))
            }
          }}
        />
      </Column>
    </Row>
  )
}
