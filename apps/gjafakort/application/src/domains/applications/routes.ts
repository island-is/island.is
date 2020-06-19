import { Router } from 'express'
import { param, body, validationResult, query } from 'express-validator'

import {
  ApplicationTypes,
  ApplicationStates,
} from '@island.is/gjafakort/consts'
import * as applicationService from './service'
import { service as auditService } from '../audit'

const router = Router()

router.get(
  '/',
  [
    query('type').isIn(Object.values(ApplicationTypes)),
    query('count')
      .isBoolean()
      .optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { type, count } = req.query
    if (count) {
      const numberOfApplications = await applicationService.getApplicationCountByType(
        type,
      )
      return res.status(200).json({ count: numberOfApplications })
    }

    const applications = await applicationService.getApplicationsByType(type)

    return res.status(200).json({ applications })
  },
)

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
    body('state')
      .optional()
      .isIn(Object.values(ApplicationStates)),
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

    const state = req.body.state || application.state
    const { data } = req.body
    application = await applicationService.updateApplication(
      application,
      state,
      data,
    )

    const publishToQueue = req.app.get('publishToQueue')
    publishToQueue(application, application.type, state)

    const title = 'Application updated'
    const { authorSSN } = req.body
    await auditService.createAuditLog(state, title, authorSSN, applicationId, {
      applicationChanges: data,
    })

    return res.status(200).json({ application })
  },
)

router.post(
  '/:applicationId/auditLog',
  [
    param('applicationId').isUUID(),
    body('authorSSN')
      .optional()
      .isLength({ min: 10, max: 10 }),
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

    const { authorSSN = '', data, title } = req.body
    const auditLog = await auditService.createAuditLog(
      application.state,
      title,
      authorSSN,
      applicationId,
      data,
    )

    return res.status(201).json({ auditLog })
  },
)

export default router
