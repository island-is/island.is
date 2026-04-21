import { m } from '@island.is/form-system/ui'
import {
  Box,
  GridColumn,
  GridRow,
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
      <GridRow>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          columnGap={4}
          marginLeft={2}
        >
          <Text variant="h3">{formatMessage(m.applicationLifetime)}</Text>
        </Box>
      </GridRow>
      <Box marginTop={7}>
        <Stack space={2}>
          <GridRow>
            <GridColumn span="5/10">
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
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span="5/10">
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
            </GridColumn>
          </GridRow>
        </Stack>
      </Box>
    </>
  )
}
