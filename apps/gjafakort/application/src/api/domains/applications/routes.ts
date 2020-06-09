import { Router } from 'express'
import { param, body, validationResult } from 'express-validator'

import { consts } from '../common'
import * as applicationService from './service'
import { service as auditService } from '../audit'

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
    body('authorSSN').isLength({ min: 10, max: 10 }),
    body('state').isIn(Object.values(consts.States)),
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

    const title = 'Application updated'
    const { authorSSN } = req.body
    await auditService.createAuditLog(state, title, authorSSN, applicationId, {
      changes: data,
    })

    return res.status(200).json({ application })
  },
)

router.post(
  '/:applicationId/auditLog',
  [
    param('applicationId').isUUID(),
    body('state').isIn(Object.values(consts.States)),
    body('authorSSN').isLength({ min: 10, max: 10 }),
    body('title')
      .not()
      .isEmpty(),
    body('data').custom((value) => {
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

    const { state, authorSSN, data, title } = req.body
    const auditLog = await auditService.createAuditLog(
      state,
      title,
      authorSSN,
      applicationId,
      data,
    )

    return res.status(201).json({ auditLog })
  },
)

export default router
