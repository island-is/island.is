import { Dispatch, SetStateAction } from 'react'
import {
  Box,
  Checkbox,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { messages as m } from '../../lib/messages'
import { FormData } from '../../utils/types'
import React from 'react'

interface LimitationsProps {
  data: string[]
  formState: FormData
  setFormState: Dispatch<SetStateAction<FormData | undefined>>
}

const Limitations = ({ data, formState, setFormState }: LimitationsProps) => {
  const { formatMessage } = useLocale()

  const checkboxChanges = (currentValue: string) => {
    const arr = formState.selectedLimitations ?? []
    if (formState.selectedLimitations?.includes(currentValue)) {
      const index = arr.indexOf(currentValue)
      if (index > -1) arr.splice(index, 1)
    } else {
      arr?.push(currentValue)
    }
    setFormState((currentState) => ({
      ...currentState,
      selectedLimitations: arr,
    }))
  }

  return (
    <Box marginTop={2}>
      <Stack space={2}>
        <Divider />
        <Box display="flex" flexDirection="row" flexWrap="wrap" width="full">
          {data.map((y, yi) => {
            return (
              <React.Fragment key={`organ-donation-limitation-${yi}`}>
                <Box width="half" marginY="smallGutter">
                  <Checkbox
                    id={`selectedLimitations.${y.toLowerCase()}`}
                    name={'selectedLimitations'}
                    label={y}
                    value={y.toLowerCase()}
                    key={`organ-donation-limitation-checkbox-${yi}`}
                    onChange={(e) => checkboxChanges(e.target.value)}
                  />
                </Box>
                {formState.selectedLimitations?.includes('annað') &&
                  (data.length ?? 0) - 1 === yi && (
                    <GridContainer>
                      <GridRow>
                        <GridColumn
                          span="5/7"
                          key={`organ-donation-limitation-${yi}`}
                        >
                          <Box marginY="gutter">
                            <InputController
                              id="organ-donation-limitation"
                              name="otherLimitations"
                              textarea
                              label={formatMessage(
                                m.organRegistrationOtherLabel,
                              )}
                              placeholder={formatMessage(
                                m.organRegistrationOtherText,
                              )}
                              maxLength={220}
                              rules={{
                                minLength: {
                                  value: 1,
                                  message: formatMessage(
                                    m.organLimitationsError,
                                  ),
                                },
                              }}
                              onChange={(e) => {
                                setFormState((currentState) => ({
                                  ...currentState,
                                  otherLimitations: e.target.value,
                                }))
                              }}
                            />
                          </Box>
                        </GridColumn>
                      </GridRow>
                    </GridContainer>
                  )}
              </React.Fragment>
            )
          })}
        </Box>
      </Stack>
    </Box>
  )
}

export default Limitations
