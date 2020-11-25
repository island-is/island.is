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

  console.log('errors', errors)
  console.log('application', application)
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
        <Link
          href="http://assets.ctfassets.net/8k0h54kbe6bj/Cy8xoQ5fX1Cef99GVYH4L/d12d148dace0528d67e59da19e732304/Design-1.0.0-DocumentProviders.pdf"
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          Tæknilýsing vegna samskipta skjalaveitu við Pósthólf (aðeins á ensku)
        </Link>
      </Box>
      <Box marginBottom={3}>
        <Link
          href="https://github.com/digitaliceland/postholf-demo"
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          Sýnidæmi á Github fyrir samskipti við Pósthólf island.is
        </Link>
      </Box>
      <Box marginBottom={3}>
        <Link
          href="http://assets.ctfassets.net/8k0h54kbe6bj/1MkIyeKtuc7c6BlbmKIOYz/c987f9e6a5d9a5284887869671c178a8/oryggisgatlisti-postholf.pdf"
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          Öryggiskröfur sem gerðar eru til skjalaveitna
        </Link>
      </Box>
      <Box marginBottom={3}>
        <Text>
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
        </Text>
      </Box>
    </Box>
  )
}

export default TestPhaseInfoScreen
