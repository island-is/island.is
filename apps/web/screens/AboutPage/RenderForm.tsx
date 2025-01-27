import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
import jsonp from 'jsonp'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
import toQueryString from 'to-querystring'

import { NewsletterSignup } from '@island.is/island-ui/core'
import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'

type FormState = {
  type: '' | 'error' | 'success'
  message: string
  validEmail: boolean
  touched: boolean
}

// This component should be generalized a bit more and moved into @web/components

export const RenderForm: React.FC<
  React.PropsWithChildren<{
    namespace: GetNamespaceQuery['getNamespace']
    heading?: string
    text?: string
    submitButtonText?: string
    inputLabel?: string
  }>
> = ({
  namespace,
  heading = 'Default heading',
  text = 'Default text',
  submitButtonText = 'Submit',
  inputLabel = 'Email',
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const [status, setStatus] = useState<FormState>({
    type: '',
    message: '',
    validEmail: false,
    touched: false,
  })

  const formatMessage = (message: string) => {
    // These messages come from Mailchimp's API and contain links and other stuff we don't want.
    if (!message) {
      return
    }
    const msg = message.toLowerCase()

    if (
      msg.includes('is already subscribed') ||
      msg.includes('er nú þegar skráður')
    ) {
      return n('formEmailAlreadyRegistered', 'Þetta netfang er þegar á skrá')
    }

    if (msg.includes('invalid email') || msg.includes('ógilt netfang')) {
      return n('formInvalidEmail', 'Þetta er ógilt netfang.')
    }

    console.warn(message)
    return ''
  }

  const handleSubmit = ({ email }: { email: string }) => {
    const validEmail = isValidEmail.test(email)

    if (!validEmail) {
      setStatus({
        type: 'error',
        message: n('formInvalidEmail', 'Invalid email'),
        validEmail,
        touched: true,
      })
    }

    const params = toQueryString({ EMAIL: email })
    const url = `https://island.us18.list-manage.com/subscribe/post-json?u=be0aa222da8be6dcb70470af8&amp;id=6b6309b799&${params}`

    if (validEmail) {
      jsonp(
        url,
        {
          param: 'c',
        },
        (err: string, data: { result: string; msg: string }) => {
          if (err) {
            setStatus({
              type: 'error',
              message: err,
              validEmail,
              touched: true,
            })
          } else if (data.result !== 'success') {
            setStatus({
              type: 'error',
              message: data.msg,
              validEmail,
              touched: true,
            })
          } else {
            setStatus({
              type: 'success',
              message: data.msg,
              validEmail,
              touched: true,
            })
          }
        },
      )
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (status.type === 'error' && formik.values.email === '') {
      setStatus({
        ...status,
        type: '',
      })
    }
  }, [status.type, formik.values.email])

  const textByStatus =
    status.type === 'success'
      ? n(
          'formCheckYourEmail',
          'Þú þarft að fara í pósthólfið þitt og samþykkja umsóknina',
        )
      : text

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewsletterSignup
        id="email"
        name="email"
        heading={heading}
        text={textByStatus}
        placeholder=""
        label={inputLabel}
        variant="blue"
        buttonText={submitButtonText}
        onChange={formik.handleChange}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        onSubmit={formik.handleSubmit}
        value={formik.values.email}
        successTitle={n('formThankYou', 'Skráning tókst. Takk fyrir.')}
        successMessage={n(
          'formCheckYourEmail',
          'Þú þarft að fara í pósthólfið þitt og samþykkja umsóknina',
        )}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        errorMessage={formatMessage(status.message)}
        state={status.type || 'default'}
      />
    </form>
  )
}
