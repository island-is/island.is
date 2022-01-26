import React from 'react'
import get from 'lodash/get'
import { EmailService, Message, Template, HeadingComponent } from '@island.is/email-service'
import { Screen } from '@island.is/web/types'
import { Application } from '@island.is/api/schema'

interface EmailProps {
  title?: string
}

const Heading = (
  copy: string,
  context?: Omit<HeadingComponent['context'], 'copy'>,
) =>
  ({
    component: 'Heading',
    context: {
      copy,
      ...(context ?? {}),
    },
  } as HeadingComponent)

const Email: Screen<EmailProps> = ({ title }): => {
  const emailService = new EmailService()
  
  const template: Template {
    title: 'title',
    body: [
      Heading(m.drivingLicenseHeading[applicationFor], {
        align: 'left',
        small: true,
        eyebrow,
      }),
    ]
  }
  return <div>ok? {title}</div>
}

Email.getInitialProps = async () => {

  return {}
}

export default Email
