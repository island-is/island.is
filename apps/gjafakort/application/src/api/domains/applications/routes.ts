import { Router } from 'express'
import { param, body, validationResult } from 'express-validator'

import * as applicationConsts from './consts'
import * as applicationService from './service'

const router = Router()

router.get(
  '/:applicationId',
  [param('applicationId').isUUID()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { applicationId } = req.params
    const application = await applicationService.getApplicationById(
      applicationId,
    )
    if (!application) {
      return res.status(404).json({
        errors: [
          {
            value: applicationId,
            message: `Application<${applicationId}> not found`,
          },
        ],
      })
    }

    return res.status(200).json({ application })
  },
)

router.put(
  '/:applicationId',
  [
    param('applicationId').isUUID(),
    body('state')
      .optional()
      .customSanitizer((value) => value || applicationConsts.States.PENDING)
      .isIn(Object.values(applicationConsts.States)),
    body('data')
      .optional()
      .custom((value) => {
        if (typeof value !== 'object' || value === null) {
          return Promise.reject('Must provide data as an object')
        }
        return true
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { applicationId } = req.params
    let application = await applicationService.getApplicationById(applicationId)
    if (!application) {
      return res.status(404).json({
        errors: [
          {
            value: applicationId,
            message: `Application<${applicationId}> not found`,
          },
        ],
      })
    }

    const { state, data } = req.body
    application = await applicationService.updateApplication(
      application,
      state,
      data,
    )

    return res.status(200).json({ application })
  },
)

export default router
