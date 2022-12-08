import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { Box, NewsletterSignup } from '@island.is/island-ui/core'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'
import {
  Image,
  EmailSignupSubscriptionMutation,
  EmailSignupSubscriptionMutationVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useMutation } from '@apollo/client/react'
import { EMAIL_SIGNUP_MUTATION } from '@island.is/web/screens/queries'

import * as styles from './MailingListSignup.css'

type FormState = {
  type: 'default' | 'error' | 'success'
  message: string
}

interface FormProps {
  email: string
}

interface MailingListSignupProps {
  namespace: Record<string, string>
  id: string
  title: string
  description: string
  inputLabel: string
  placeholder?: string
  buttonText: string
  signupID: string
  image?: Image
}

export const MailingListSignup: React.FC<MailingListSignupProps> = ({
  namespace,
  id,
  title,
  description,
  inputLabel,
  placeholder,
  buttonText,
  signupID,
  image,
}) => {
  const n = useNamespace(namespace)
  const [status, setStatus] = useState<FormState>({
    type: 'default',
    message: '',
  })

  const [subscribeToMailchimp] = useMutation<
    EmailSignupSubscriptionMutation,
    EmailSignupSubscriptionMutationVariables
  >(EMAIL_SIGNUP_MUTATION)

  const handleSubmit = ({ email }: FormProps) => {
    if (isValidEmail.test(email)) {
      subscribeToMailchimp({
        variables: {
          input: {
            signupID,
            inputFields: [{ name: 'EMAIL', type: 'email', value: email }],
          },
        },
      })
        .then((result) => {
          if (result?.data?.emailSignupSubscription?.subscribed) {
            const successMessage: string = n(
              'formSuccess',
              'Þú þarft að fara í pósthólfið þitt og samþykkja umsóknina. Takk fyrir.',
            )
            setStatus({
              type: 'success',
              message: successMessage,
            })
          } else {
            setStatus({
              type: 'error',
              message: n('formEmailUnknownError', 'Óþekkt villa.'),
            })
          }
        })
        .catch(() =>
          setStatus({
            type: 'error',
            message: n('formEmailUnknownError', 'Óþekkt villa.'),
          }),
        )
    } else {
      // Email address is not valid.
      setStatus({
        ...status,
        type: 'error',
        message: n('formInvalidEmail', 'Þetta er ógilt netfang.'),
      })
    }
  }

  /**
   * Initialize Formik
   */
  const formikInitialValues: FormProps = { email: '' }
  const formik = useFormik({
    initialValues: formikInitialValues,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (status.type === 'error' && formik.values.email === '') {
      // Reset the form to default state when the User clears the
      // email input field after getting an error.
      setStatus({
        ...status,
        type: 'default',
        message: '',
      })
    }
  }, [status.type, formik.values.email])

  return (
    <Box
      display="flex"
      flexDirection="row"
      background="blue100"
      paddingX={[2, 2, 8]}
      paddingY={[2, 2, 6]}
    >
      {image?.url && <img className={styles.image} src={image.url} alt="" />}
      <NewsletterSignup
        id={id}
        name="email"
        heading={title}
        text={description}
        placeholder={placeholder}
        label={inputLabel}
        buttonText={buttonText}
        variant="blue"
        onChange={formik.handleChange}
        onSubmit={formik.handleSubmit}
        value={formik.values.email}
        errorMessage={status.type === 'error' ? status.message : ''}
        successTitle={n('formSuccessTitle', 'Skráning tókst')}
        successMessage={status.type === 'success' ? status.message : ''}
        state={status.type}
      />
    </Box>
  )
}
