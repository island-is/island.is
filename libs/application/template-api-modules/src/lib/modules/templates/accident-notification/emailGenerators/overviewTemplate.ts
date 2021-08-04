import { Application } from '@island.is/application/core'
import {
  messages,
  AccidentNotificationAnswers,
} from '@island.is/application/templates/accident-notification'
import { dedent } from 'ts-dedent'

export const overviewTemplate = (application: Application): string => {
  const answers = application.answers as AccidentNotificationAnswers

  return dedent(`
    <h3>Overview Heading</h3>
    <p>
    Overview
    </p>
  `)
}
