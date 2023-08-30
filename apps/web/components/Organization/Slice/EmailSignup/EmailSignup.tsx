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
  Text,
} from '@island.is/island-ui/core'
import { FormField } from '@island.is/web/components'
import { FormFieldType } from '../../../Form/Form'
import {
  EmailSignup as EmailSignupSchema,
  EmailSignupInputField,
  EmailSignupSubscriptionMutation,
  EmailSignupSubscriptionMutationVariables,
} from '@island.is/web/graphql/schema'
import { EMAIL_SIGNUP_MUTATION } from '@island.is/web/screens/queries'
import { useNamespace } from '@island.is/web/hooks'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'
import { isValidNationalId } from '@island.is/web/utils/isValidNationalId'

import * as styles from './EmailSignup.css'

type SubmitResponse = {
  message: string
  type: AlertMessageType
  title: string
} | null

const getInitialValues = (
  formFields: EmailSignupSchema['formFields'],
): Record<string, string> => {
  return formFields?.reduce((acc: Record<string, unknown>, curr) => {
    if (curr?.name) {
      acc[curr.name] = ''
    }
    return acc
  }, {}) as Record<string, string>
}

interface EmailSignupProps {
  slice: EmailSignupSchema
  marginLeft?: ResponsiveSpace
}

const EmailSignup = ({ slice, marginLeft }: EmailSignupProps) => {
  const n = useNamespace(slice.translations ?? {})
  const formFields = useMemo(
    () =>
      slice.formFields?.filter(
        (field) => field?.name && field?.type !== FormFieldType.INFORMATION,
      ) ?? [],
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
      if (field?.required && !value) {
        newErrors[fieldName] = n(
          'fieldIsRequired',
          'Þennan reit þarf að fylla út',
        )
      } else if (
        field?.type === FormFieldType.EMAIL &&
        !isValidEmail.test(value as string)
      ) {
        newErrors[fieldName] = n(
          'invalidEmail',
          'Vinsamlegast sláðu inn gilt netfang',
        )
      } else if (
        field?.type === FormFieldType.CHECKBOXES &&
        value &&
        field.required &&
        !Object.values(JSON.parse(value)).some((v) => v === 'true')
      ) {
        newErrors[fieldName] = n(
          'fieldIsRequired',
          'Þennan reit þarf að fylla út',
        )
      } else if (
        field?.type === FormFieldType.NATIONAL_ID &&
        field?.required &&
        !isValidNationalId(value)
      ) {
        newErrors[fieldName] = n(
          'formInvalidNationalId',
          'Þetta er ekki gild kennitala.',
        )
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    const inputFields: EmailSignupInputField[] = []

    for (const [fieldName, value] of Object.entries(values)) {
      const field = formFields.find((f) => f.name === fieldName)
      inputFields.push({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        id: field?.id,
        name: fieldName,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        type: field?.type,
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
        if (result?.data?.emailSignupSubscription?.subscribed) {
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
              'Ekki tókst að skrá þig á póstlistann, reynið aftur síðar',
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
      paddingY={[3, 3, 5]}
      paddingX={[3, 3, 3, 3, 12]}
      borderRadius="large"
      background="blue100"
      marginLeft={marginLeft}
    >
      <form onSubmit={handleSubmit}>
        <Box display="flex" alignItems="flexStart">
          {slice?.translations?.leftImageSrc && (
            <img
              src={slice.translations.leftImageSrc}
              className={styles.image}
              alt=""
            />
          )}
          <Box width="full">
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
                  <Box marginTop={5}>
                    <AlertMessage {...submitResponse} />
                  </Box>
                ) : (
                  <Box width="full" marginTop={5}>
                    {(slice.formFields ?? []).map((field) => {
                      return (
                        <Box key={field.id} marginBottom={3} width="full">
                          <FormField
                            field={field}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore make web strict
                            slug={field.name}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore make web strict
                            error={errors[field.name]}
                            onChange={(slug, value) => {
                              if (field.type !== FormFieldType.CHECKBOXES) {
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
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore make web strict
                                const prevFieldValues = prevValues[field.name]
                                if (prevFieldValues) {
                                  const json = JSON.parse(prevFieldValues)
                                  json[option] =
                                    json[option] === 'false' || !json[option]
                                      ? 'true'
                                      : 'false'
                                  return {
                                    ...prevValues,
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore make web strict
                                    [field.name]: JSON.stringify(json),
                                  }
                                }

                                // The option always starts off as false so if there is nothing previously stored it's safe to toggle the option on
                                return {
                                  ...prevValues,
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore make web strict
                                  [field.name]: JSON.stringify({
                                    [option]: 'true',
                                  }),
                                }
                              })
                            }}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore make web strict
                            value={values[field.name]}
                          />
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </GridColumn>
            </GridRow>
          </Box>
        </Box>

        {!submitResponse && (
          <GridRow>
            <GridColumn span="1/1">
              <Box width="full" display="flex" justifyContent="flexEnd">
                <Button disabled={loading} type="submit">
                  {n('submitButtonText', 'Skrá')}
                </Button>
              </Box>
            </GridColumn>
          </GridRow>
        )}
      </form>
    </Box>
  )
}

export default EmailSignup
