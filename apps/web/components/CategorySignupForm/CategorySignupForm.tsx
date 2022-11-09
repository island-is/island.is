import React, { useMemo, useState } from 'react'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'
import { useFormik } from 'formik'
import {
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  MailchimpSubscribeMutation,
  MailchimpSubscribeMutationVariables,
  MailingListSignupSlice,
  Namespace,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useMutation } from '@apollo/client/react'
import { MAILING_LIST_SIGNUP_MUTATION } from '@island.is/web/screens/queries'

interface FormProps {
  email?: string
  name?: string
  toggle?: string
}

interface MessageProps {
  type: string
  text: string
}

interface NameSignupFormProps {
  namespace: Namespace
  slice: MailingListSignupSlice
}

export const CategorySignupForm = ({
  namespace,
  slice,
}: NameSignupFormProps) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<MessageProps>({ type: '', text: '' })
  const [checked, setChecked] = useState(false)

  const n = useNamespace(namespace)
  const categories = useMemo(() => JSON.parse(slice.categories ?? '[]'), [
    slice,
  ])
  const inputs = useMemo(() => JSON.parse(slice.inputs ?? '[]'), [slice])

  const validate = async (values) => {
    const errors: FormProps = {}

    if (!values.name.length) {
      errors.name = 'invalid'
    }
    if (!isValidEmail.test(values.email)) {
      errors.email = 'invalid'
    }

    return errors
  }

  const [subscribeToMailchimp] = useMutation<
    MailchimpSubscribeMutation,
    MailchimpSubscribeMutationVariables
  >(MAILING_LIST_SIGNUP_MUTATION)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      toggle: 'Yes',
      ...Object.fromEntries(
        categories.map((_, idx) => [`category-${idx}`, false]),
      ),
      ...Object.fromEntries(inputs),
    },
    validateOnChange: false,
    validate,
    onSubmit: () => {
      setLoading(true)
      subscribeToMailchimp({
        variables: {
          input: {
            signupID: slice.id,
            email: formik.values.email,
            name: formik.values.name,
            inputFields: inputs.map((input) => ({
              ...input,
              value: formik.values[input.name],
            })),
            categories: categories
              .map((category, idx) => idx)
              .filter((idx) => formik.values[`category-${idx}`]),
          },
        },
      })
        .then((result) => {
          if (result?.data?.mailchimpSubscribe?.subscribed) {
            setMessage({
              type: 'success',
              text: n('formSuccessTitle', 'Skráning tókst, takk fyrir!'),
            })
          } else {
            setMessage({
              type: 'error',
              text: n(
                'formEmailUnknownError',
                'Óþekkt villa kom upp, reynið aftur síðar.',
              ),
            })
          }
        })
        .catch(() => {
          setMessage({
            type: 'error',
            text: n(
              'formEmailUnknownError',
              'Óþekkt villa kom upp, reynið aftur síðar.',
            ),
          })
        })
    },
  })

  return (
    <Box
      paddingY={[3, 3, 8]}
      paddingX={[3, 3, 3, 3, 15]}
      borderRadius="large"
      background="blue100"
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack space={5}>
          <GridRow>
            <GridColumn span={'12/12'} paddingBottom={message ? 0 : 3}>
              <Text as="h3" variant="h3" color="blue600">
                {slice.title}
              </Text>
            </GridColumn>
          </GridRow>
          {message.type ? (
            <GridRow>
              <GridColumn span={'12/12'}>
                <Text variant="h4" color="blue600">
                  {message.text}
                </Text>
              </GridColumn>
            </GridRow>
          ) : (
            <>
              <GridRow>
                <GridColumn span="12/12" paddingBottom={3}>
                  <Input
                    name="name"
                    label={slice.fullNameLabel}
                    required
                    errorMessage={n(
                      'formInvalidName',
                      'Þennan reit þarf að fylla út.',
                    )}
                    hasError={!!formik.errors.name}
                    defaultValue=""
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                </GridColumn>
                <GridColumn span="12/12">
                  <Input
                    name="email"
                    label={slice.inputLabel}
                    defaultValue=""
                    required
                    errorMessage={n(
                      'formInvalidEmail',
                      'Þetta er ógilt netfang.',
                    )}
                    hasError={!!formik.errors.email}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </GridColumn>
                {inputs.map((input) => (
                  <GridColumn span="12/12">
                    <Input
                      name={input.name}
                      label={input.label}
                      defaultValue=""
                      required={input.required}
                      errorMessage={n(
                        'formInvalidName',
                        'Þennan reit þarf að fylla út.',
                      )}
                      hasError={!!formik.errors[input.name]}
                      onChange={formik.handleChange}
                      value={formik.values[input.name]}
                    />
                  </GridColumn>
                ))}
              </GridRow>
              <GridRow>
                <GridColumn span={['12/12', '12/12', '12/12', '12/12', '9/12']}>
                  <Text variant="h4" as="h4" color="blue600" marginBottom={2}>
                    {slice.categoryLabel}
                  </Text>
                  {categories.map((category, idx) => (
                    <Box marginBottom={2} marginLeft={2}>
                      <Checkbox
                        label={category.label}
                        name={`category-${idx}`}
                        checked={formik.values[`category-${idx}`]}
                        onChange={formik.handleChange}
                      />
                    </Box>
                  ))}
                </GridColumn>
              </GridRow>
              {slice.disclaimerLabel && (
                <GridRow>
                  <Box>
                    <Checkbox
                      label={slice.disclaimerLabel}
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                  </Box>
                </GridRow>
              )}
              <GridRow>
                <Box width="full" display="flex" justifyContent="flexEnd">
                  <Button
                    type="submit"
                    disabled={(slice.disclaimerLabel && !checked) || loading}
                  >
                    {slice.buttonText}
                  </Button>
                </Box>
              </GridRow>
            </>
          )}
        </Stack>
      </form>
    </Box>
  )
}
