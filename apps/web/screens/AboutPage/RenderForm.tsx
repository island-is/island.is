import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import toQueryString from 'to-querystring'
import jsonp from 'jsonp'
import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'
import {
  GridColumn,
  GridContainer,
  GridRow,
  NewsletterSignup,
} from '@island.is/island-ui/core'

type FormState = {
  type: '' | 'error' | 'success'
  message: string
  validEmail: boolean
  touched: boolean
}

// This component should be generalized a bit more and moved into @web/components

export const RenderForm: React.FC<{
  namespace: GetNamespaceQuery['getNamespace']
}> = ({ namespace }) => {
  const n = useNamespace(namespace)
  const [status, setStatus] = useState<FormState>({
    type: '',
    message: '',
    validEmail: false,
    touched: false,
  })

  const formatMessage = (message) => {
    if (!message) {
      return
    }
    const msg = message.toLowerCase()

    if (msg.includes('is already subscribed')) {
      return n('formEmailAlreadyRegistered', 'Þetta netfang er þegar á skrá')
    }

    if (msg.includes('something went wrong')) {
      return n('formError', 'Það kom upp villa. Vinsamlegast reyndu aftur.')
    }

    if (msg.includes('invalid email')) {
      return n('formInvalidEmail', 'Þetta er ógilt netfang.')
    }

    console.warn(message)
    return ''
  }

  const handleSubmit = ({ email }) => {
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
        (err, data) => {
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

  const heading =
    status.type === 'success'
      ? n('formThankYou', 'Skráning tókst. Takk fyrir.')
      : n('formCtaHeading', 'Vertu með')
  const text =
    status.type === 'success'
      ? n(
          'formCheckYourEmail',
          'Þú þarft að fara í pósthólfið þitt og samþykkja umsóknina',
        )
      : n(
          'formCtaText',
          'Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í stafrænni opinberri þjónustu.',
        )

  return (
    <form onSubmit={formik.handleSubmit}>
      <GridContainer>
        <GridRow>
          <GridColumn
            offset="1/12"
            span={['12/12', '12/12', '10/12', '10/12', '7/10']}
          >
            <NewsletterSignup
              id="email"
              heading={heading}
              text={text}
              placeholder="Netfangið þitt"
              label="Netfang"
              buttonText="Skrá mig á póstlista"
              onChange={formik.handleChange}
              value={formik.values.email}
              errorMessage={formatMessage(status.message)}
              state={status.type || 'default'}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </form>
  )
}
