import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Input,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Text } from '@island.is/island-ui/core'
import { ControlContext } from '../../../../context/ControlContext'
import { useContext } from 'react'

export const Lifetime = () => {
  const { formatMessage } = useIntl()
  const { control, controlDispatch, setFocus, focus, formUpdate } =
    useContext(ControlContext)
  const { form, isPublished } = control

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
                placeholder={formatMessage(m.max30Days)}
                name="applicationsDaysToRemove"
                value={
                  form.daysUntilApplicationPrune === 0
                    ? ''
                    : form.daysUntilApplicationPrune ?? ''
                }
                backgroundColor="blue"
                readOnly={isPublished}
                type="number"
                max={30}
                min={1}
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value !== focus) {
                    if (e.target.value === '' || Number(e.target.value) < 1) {
                      e.target.value = '1'
                      controlDispatch({
                        type: 'CHANGE_DAYS_UNTIL_APPLICATION_PRUNE',
                        payload: { value: 1 },
                      })
                      formUpdate({ ...form, daysUntilApplicationPrune: 1 })
                    } else {
                      formUpdate()
                    }
                  }
                }}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value <= 30) {
                    controlDispatch({
                      type: 'CHANGE_DAYS_UNTIL_APPLICATION_PRUNE',
                      payload: { value: parseInt(e.target.value) },
                    })
                  }
                }}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span="10/10">
              <Input
                label={formatMessage(m.lifetimeAfterSubmission)}
                placeholder={formatMessage(m.max60Days)}
                name="applicationsDaysToRemove"
                value={
                  form.daysUntilApplicationPrune === 0
                    ? ''
                    : form.daysUntilApplicationPrune ?? ''
                }
                backgroundColor="blue"
                readOnly={isPublished}
                type="number"
                max={60}
                min={1}
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value !== focus) {
                    if (e.target.value === '' || Number(e.target.value) < 1) {
                      e.target.value = '1'
                      controlDispatch({
                        type: 'CHANGE_DAYS_UNTIL_APPLICATION_PRUNE',
                        payload: { value: 1 },
                      })
                      formUpdate({ ...form, daysUntilApplicationPrune: 1 })
                    } else {
                      formUpdate()
                    }
                  }
                }}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value <= 60) {
                    controlDispatch({
                      type: 'CHANGE_DAYS_UNTIL_APPLICATION_PRUNE',
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
