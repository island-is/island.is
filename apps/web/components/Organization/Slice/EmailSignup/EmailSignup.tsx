import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { FormField } from '@island.is/web/components'
import { EmailSignup as EmailSignupSchema } from '@island.is/web/graphql/schema'

const getInitialValues = (formFields: EmailSignupSchema['formFields']) => {
  const formFieldsWithNames = formFields?.filter((field) => field?.name) ?? []
  return formFieldsWithNames.reduce((acc, curr) => {
    acc[curr.name] = ''
    return acc
  }, {})
}

interface EmailSignupProps {
  slice: EmailSignupSchema
}

const EmailSignup = ({ slice }: EmailSignupProps) => {
  const formFields = useMemo(
    () => slice.formFields?.filter((field) => field?.name) ?? [],
    [slice.formFields],
  )

  const [values, setValues] = useState(getInitialValues(formFields))

  return (
    <Box
      paddingY={[3, 3, 8]}
      paddingX={[3, 3, 3, 3, 15]}
      borderRadius="large"
      background="blue100"
    >
      <form>
        <Stack space={5}>
          <GridRow>
            <GridColumn span={'12/12'}>
              <Text as="h3" variant="h3" color="blue600">
                {slice.title}
              </Text>
              <Text>{slice.description}</Text>
            </GridColumn>
          </GridRow>

          <GridRow>
            <GridColumn span="1/1">
              {formFields.map((field) => {
                return (
                  <Box key={field.id} marginBottom={3} width="full">
                    <FormField
                      field={field}
                      slug={field.name}
                      onChange={(slug, value) =>
                        setValues((prevValues) => ({
                          ...prevValues,
                          [slug]: value,
                        }))
                      }
                      value={values[field.name]}
                    />
                  </Box>
                )
              })}
            </GridColumn>
          </GridRow>

          <GridRow>
            <Box width="full" display="flex" justifyContent="flexEnd">
              <Button type="submit">
                {slice.configuration['submitButtonText'] || 'Skrá'}
              </Button>
            </Box>
          </GridRow>
        </Stack>
      </form>
    </Box>
  )
}

export default EmailSignup
