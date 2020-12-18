import jwt from 'jsonwebtoken'

import { Application } from '@island.is/application/core'

export const createAssignToken = (application: Application, secret: string) => {
  const token = jwt.sign(
    {
      applicationId: application.id,
    },
    secret,
    { expiresIn: 24 * 60 * 60 },
  )

  return token
}
