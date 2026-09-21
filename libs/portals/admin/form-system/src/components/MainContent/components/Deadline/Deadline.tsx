import { useMutation } from '@apollo/client'
import { UpdateFormResponse } from '@island.is/form-system/shared'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Checkbox,
  GridColumn as Column,
  DatePicker,
  GridRow as Row,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useContext, useRef } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../context/ControlContext'

export const Deadline = () => {
  const { control, controlDispatch, formUpdate } = useContext(ControlContext)
  const { form, isReadOnly } = control
  const { formatMessage } = useIntl()
  const skipInvalidationDateCloseUpdate = useRef(false)

  return (
    <>
      <Row>
        <Box marginLeft={1}>
          <Text variant="h3">Umsóknarfrestur og aðgengi að umsóknarformi</Text>
        </Box>
      </Row>
      <Box marginTop={2} />
      <Row>
        <Column span="6/10">
          <Text variant="medium">
            Veldu dagsetningu hvenær umsóknarfrestur rennur út. Formið verður
            tekið úr útgáfu þegar fresturinn rennur út. Verkið sem sér um að
            taka form úr útgáfu er keyrt á hálftíma fresti.
            <br />
            Þegar form er tekið úr útgáfu fer það í geymslu og verður ekki hægt
            að nálgast það lengur. Svo er formið afritað með sama slug (sömu
            slóð) og vistað í stöðunni "Í vinnslu" og að auki verður hakað í
            "Loka fyrir aðgengi að umsóknarforminu" svo að það sé ekki hægt að
            nálgast það lengur.
            <br /> Það er gert til þess að sá sem opnar formið eftir að
            fresturinn er útrunninn kemst ekki óvænt inn í formið í vinnslu og
            sendir inn test-umsókn.
          </Text>
        </Column>
      </Row>
      <Box marginTop={2} />
      <Row>
        <Column span="6/10">
          <DatePicker
            label={formatMessage(m.deadline)}
            placeholderText={formatMessage(m.chooseDate)}
            backgroundColor="blue"
            disabled={isReadOnly}
            isClearable={true}
            showTimeInput={true}
            locale="is"
            handleClear={() => {
              const updatedForm = { ...form, invalidationDate: null }
              skipInvalidationDateCloseUpdate.current = true
              controlDispatch({
                type: 'CHANGE_INVALIDATION_DATE',
                payload: { value: null },
              })
              formUpdate(updatedForm)
            }}
            minDate={new Date()}
            selected={
              form.invalidationDate ? new Date(form.invalidationDate) : null
            }
            handleChange={(e) => {
              const updatedForm = { ...form, invalidationDate: e }
              skipInvalidationDateCloseUpdate.current = true
              controlDispatch({
                type: 'CHANGE_INVALIDATION_DATE',
                payload: { value: e },
              })
              formUpdate(updatedForm)
            }}
            handleCloseCalendar={() => {
              if (skipInvalidationDateCloseUpdate.current) {
                skipInvalidationDateCloseUpdate.current = false
                return
              }
              formUpdate()
            }}
          />
        </Column>
      </Row>
      <Box marginTop={5} />
      <Row>
        <Column span="6/10">
          <Text variant="medium">
            Það er gott að hafa lokað fyrir aðgengi að umsóknarformi eftir að
            það er tekið úr notkun til að koma í veg fyrir að notendur stofni og
            sendi óvart inn test-umsóknir (Þegar form er tekið úr notkun fer það
            í geymslu og er það afritað með sama slug og hefur þ.a.l. sömu slóð
            og áður nema afritið er í stöðunni "Í vinnslu").
          </Text>
        </Column>
      </Row>
      <Box marginTop={1} />
      <Row>
        <Column span="6/10">
          <Checkbox
            label="Loka fyrir aðgengi að umsóknarforminu"
            disabled={isReadOnly}
            checked={form.isInaccessible ?? false}
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_IS_INACCESSIBLE',
                payload: {
                  value: e.target.checked,
                  update: formUpdate,
                },
              })
            }}
          />
        </Column>
      </Row>
    </>
  )
}
