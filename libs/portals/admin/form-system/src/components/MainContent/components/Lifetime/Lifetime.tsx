import { m } from '@island.is/form-system/ui'
import {
  Box,
  GridColumn as Column,
  GridRow as Row,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../context/ControlContext'

export const Lifetime = () => {
  const { formatMessage } = useIntl()
  const { control, controlDispatch, setFocus, focus, formUpdate } =
    useContext(ControlContext)
  const { form, isReadOnly } = control

  return (
    <>
      <Row>
        <Box marginLeft={1}>
          <Text variant="h3">{formatMessage(m.applicationLifetime)}</Text>
        </Box>
      </Row>
      <Box marginTop={2}></Box>
      <Row>
        <Column span="6/10">
          <Text variant="medium">
            Veldu hversu lengi umsóknin lifir í kerfinu á meðan hún er í vinnslu
            áður en henni verður eytt úr kerfinu og hversu lengi umsóknin lifir
            eftir að hún hefur verið send inn áður en hún verður prúnuð. <br />{' '}
            Þegar umsókn er prúnuð verður öllum innsláttargögnum hennar eytt úr
            kerfinu en við höldum eftir sögu hennar.
          </Text>
        </Column>
      </Row>
      <Box marginTop={2}>
        <Stack space={2}>
          <Row>
            <Column span="5/10">
              <Input
                label={formatMessage(m.lifetimeWhileInDraft)}
                placeholder={formatMessage(m.max60Days)}
                name="draftDaysToLive"
                value={
                  form.draftDaysToLive === 0 ? '' : form.draftDaysToLive ?? ''
                }
                backgroundColor="blue"
                readOnly={isReadOnly}
                type="number"
                max={60}
                min={1}
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value !== focus) {
                    if (e.target.value === '' || Number(e.target.value) < 1) {
                      e.target.value = '1'
                      controlDispatch({
                        type: 'CHANGE_DRAFT_DAYS_TO_LIVE',
                        payload: { value: 1 },
                      })
                      formUpdate({ ...form, draftDaysToLive: 1 })
                    } else {
                      formUpdate()
                    }
                  }
                }}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value <= 60) {
                    controlDispatch({
                      type: 'CHANGE_DRAFT_DAYS_TO_LIVE',
                      payload: { value: parseInt(e.target.value) },
                    })
                  }
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column span="5/10">
              <Input
                label={formatMessage(m.lifetimeAfterSubmission)}
                placeholder={formatMessage(m.max30Days)}
                name="submissionDaysToLive"
                value={
                  form.submissionDaysToLive === 0
                    ? ''
                    : form.submissionDaysToLive ?? ''
                }
                backgroundColor="blue"
                readOnly={isReadOnly}
                type="number"
                max={30}
                min={1}
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value !== focus) {
                    if (e.target.value === '' || Number(e.target.value) < 1) {
                      e.target.value = '1'
                      controlDispatch({
                        type: 'CHANGE_SUBMISSION_DAYS_TO_LIVE',
                        payload: { value: 1 },
                      })
                      formUpdate({ ...form, submissionDaysToLive: 1 })
                    } else {
                      formUpdate()
                    }
                  }
                }}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value <= 30) {
                    controlDispatch({
                      type: 'CHANGE_SUBMISSION_DAYS_TO_LIVE',
                      payload: { value: parseInt(e.target.value) },
                    })
                  }
                }}
              />
            </Column>
          </Row>
        </Stack>
      </Box>
    </>
  )
}
