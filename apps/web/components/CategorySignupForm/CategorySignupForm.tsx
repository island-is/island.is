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

  const n = useNamespace(namespace)
  const categories = useMemo(() => JSON.parse(slice.categories), [slice])

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
        categories.map((category, idx) => [`category-${idx}`, false]),
      ),
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
                <GridColumn span={['12/12', '12/12', '12/12', '12/12', '3/12']}>
                  <Box
                    display="flex"
                    flexDirection={[
                      'row',
                      'row',
                      'row',
                      'row',
                      'columnReverse',
                    ]}
                    height="full"
                  >
                    <Box marginTop={2}>
                      <Button type="submit" disabled={loading}>
                        {slice.buttonText}
                      </Button>
                    </Box>
                  </Box>
                </GridColumn>
              </GridRow>
            </>
          )}
        </Stack>
      </form>
    </Box>
  )
}
