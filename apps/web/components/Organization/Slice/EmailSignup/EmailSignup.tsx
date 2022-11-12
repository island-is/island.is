import { FormEvent, useMemo, useState } from 'react'
import { useMutation } from '@apollo/client'

import {
  AlertMessage,
  AlertMessageType,
  Box,
  Button,
  GridColumn,
  GridRow,
  ResponsiveSpace,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { FormField } from '@island.is/web/components'
import {
  EmailSignup as EmailSignupSchema,
  EmailSignupInputField,
  EmailSignupSubscriptionMutation,
  EmailSignupSubscriptionMutationVariables,
} from '@island.is/web/graphql/schema'
import { EMAIL_SIGNUP_MUTATION } from '@island.is/web/screens/queries'
import { useNamespace } from '@island.is/web/hooks'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'

enum FieldType {
  CHECKBOXES = 'checkboxes',
  EMAIL = 'email',
}

type SubmitResponse = {
  message: string
  type: AlertMessageType
  title: string
} | null

const getInitialValues = (formFields: EmailSignupSchema['formFields']) => {
  return formFields.reduce((acc, curr) => {
    acc[curr.name] = ''
    return acc
  }, {})
}

interface EmailSignupProps {
  slice: EmailSignupSchema
  marginLeft?: ResponsiveSpace
}

const EmailSignup = ({ slice, marginLeft }: EmailSignupProps) => {
  const n = useNamespace(slice.translations ?? {})
  const formFields = useMemo(
    () => slice.formFields?.filter((field) => field?.name) ?? [],
    [slice.formFields],
  )

  const [values, setValues] = useState<Record<string, string>>(
    getInitialValues(formFields),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse>(null)

  const [subscribe, { loading }] = useMutation<
    EmailSignupSubscriptionMutation,
    EmailSignupSubscriptionMutationVariables
  >(EMAIL_SIGNUP_MUTATION)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const newErrors: Record<string, string> = {}

    for (const [fieldName, value] of Object.entries(values)) {
      const field = formFields.find((f) => f.name === fieldName)
      if (field.required && !value) {
        newErrors[fieldName] = n(
          'fieldIsRequired',
          'Þennan reit þarf að fylla út',
        )
      } else if (
        field.type === FieldType.EMAIL &&
        !isValidEmail.test(value as string)
      ) {
        newErrors[fieldName] = n(
          'invalidEmail',
          'Vinsamlegast sláðu inn gilt netfang',
        )
      } else if (
        field.type === FieldType.CHECKBOXES &&
        value &&
        field.required &&
        !Object.values(JSON.parse(value)).some((v) => v === 'true')
      ) {
        newErrors[fieldName] = n(
          'fieldIsRequired',
          'Þennan reit þarf að fylla út',
        )
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    const inputFields: EmailSignupInputField[] = []

    for (const [fieldName, value] of Object.entries(values)) {
      const field = formFields.find((f) => f.name === fieldName)
      inputFields.push({
        name: fieldName,
        type: field.type,
        value,
      })
    }

    subscribe({
      variables: {
        input: {
          signupID: slice.id,
          inputFields,
        },
      },
    })
      .then((result) => {
        if (result?.data.emailSignupSubscription?.subscribed) {
          setSubmitResponse({
            type: 'success',
            title: n('submitSuccessTitle', 'Skráning tókst') as string,
            message: n(
              'submitSuccessMessage',
              'Þú þarft að fara í pósthólfið þitt og samþykkja umsóknina. Takk fyrir',
            ) as string,
          })
        } else {
          setSubmitResponse({
            type: 'default',
            title: '',
            message: n(
              'submitFailureMessage',
              'Ekki tókst að skrá þig póstlistann, reynið aftur síðar',
            ) as string,
          })
        }
      })
      .catch(() => {
        setSubmitResponse({
          type: 'error',
          title: '',
          message: n(
            'submitError',
            'Villa kom upp við skráningu á póstlista',
          ) as string,
        })
      })
  }

  return (
    <Box
      paddingY={[3, 3, 8]}
      paddingX={[3, 3, 3, 3, 15]}
      borderRadius="large"
      background="blue100"
      marginLeft={marginLeft}
    >
      <form onSubmit={handleSubmit}>
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
              {submitResponse ? (
                <AlertMessage {...submitResponse} />
              ) : (
                <Box width="full">
                  {formFields.map((field) => {
                    return (
                      <Box key={field.id} marginBottom={3} width="full">
                        <FormField
                          field={field}
                          slug={field.name}
                          error={errors[field.name]}
                          onChange={(slug, value) => {
                            if (field.type !== FieldType.CHECKBOXES) {
                              return setValues((prevValues) => ({
                                ...prevValues,
                                [slug]: value,
                              }))
                            }

                            // The checkboxes type can have many options selected at a time (unlike the radio type)

                            // The slug is esssentially the option instead of being the field name
                            const option = slug
                            return setValues((prevValues) => {
                              // We store a stringified object behind the field.name key
                              const prevFieldValues = prevValues[field.name]
                              if (prevFieldValues) {
                                const json = JSON.parse(prevFieldValues)
                                json[option] =
                                  json[option] === 'false' || !json[option]
                                    ? 'true'
                                    : 'false'
                                return {
                                  ...prevValues,
                                  [field.name]: JSON.stringify(json),
                                }
                              }

                              // The option always starts off as false so if there is nothing previously stored it's safe to toggle the option on
                              return {
                                ...prevValues,
                                [field.name]: JSON.stringify({
                                  [option]: 'true',
                                }),
                              }
                            })
                          }}
                          value={values[field.name]}
                        />
                      </Box>
                    )
                  })}
                </Box>
              )}
            </GridColumn>
          </GridRow>

          {!submitResponse && (
            <GridRow>
              <Box width="full" display="flex" justifyContent="flexEnd">
                <Button disabled={loading} type="submit">
                  {n('submitButtonText', 'Skrá')}
                </Button>
              </Box>
            </GridRow>
          )}
        </Stack>
      </form>
    </Box>
  )
}

export default EmailSignup
