import React, { FC } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { m } from '../../../forms/messages'
import { useFormContext, Controller } from 'react-hook-form'
import { Box, Text, Checkbox, Link } from '@island.is/island-ui/core'

const TestPhaseInfoScreen: FC<FieldBaseProps> = ({ field, application }) => {
  const { answers: formValue } = application

  const currentAnswer = getValueViaPath(
    formValue,
    'technicalAnswer' as string,
    false,
  ) as boolean
  const { setValue, errors, getValues } = useFormContext()

  return (
    <Box>
      <Box marginBottom={3}>
        <Text>
          <strong>
            Nú er komið að því að þú klárir forritunarskilin hjá þér áður en þú
            heldur áfram í umsóknarferlinu.
          </strong>
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text>
          Þegar forritunarskilum er lokið er hægt að koma aftur að umsókninni
          til að klára ferlið. Það er á ábyrgð skjalaveitanda að
          forritunarskilin uppfylli öryggiskröfur og kröfur um virkni.
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text>
          Það er einnig á ábyrgð útfærsluaðila að prófa þjónustuna vel hjá sér
          áður en farið er á raun umhverfi. Til aðstoðar verða sjálfvirk próf
          þegar eigin prófunum er lokið. Sjálfvirku prófin eru ekki tæmandi, því
          er mikilvægt að útfærsluaðili prófi allt einnig í þaula.
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Controller
          name="technicalAnswer"
          defaultValue={currentAnswer}
          rules={{ required: true }}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue('technicalAnswer' as string, e.target.checked)
                }}
                checked={value}
                name="technicalAnswer"
                label={m.technicalAgreementOptionLabel.defaultMessage}
                large
                hasError={
                  errors.technicalAnswer &&
                  getValues('technicalAnswer') === false
                }
                errorMessage={errors.technicalAnswer}
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}

export default TestPhaseInfoScreen
