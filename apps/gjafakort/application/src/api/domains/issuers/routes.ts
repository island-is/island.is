import { Router } from 'express'
import { param, body, validationResult } from 'express-validator'

import { consts } from '../common'
import * as issuerService from './service'
import { service as applicationService } from '../applications'
import { service as auditService } from '../audit'

const router = Router()

router.post(
  '/:ssn/applications',
  [
    param('ssn').isLength({ min: 10, max: 10 }),
    body('authorSSN').isLength({ min: 10, max: 10 }),
    body('type').isIn(Object.values(consts.Types)),
    body('state')
      .optional()
      .customSanitizer((value) => value || consts.States.PENDING)
      .isIn(Object.values(consts.States)),
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

    const { ssn } = req.params
    let issuer = await issuerService.getIssuer(ssn)
    if (!issuer) {
      issuer = await issuerService.createIssuer(ssn)
    }

    const { type, state, data } = req.body
    let application = await applicationService.getApplicationByIssuerAndType(
      ssn,
      type,
    )
    if (application) {
      return res.status(400).json({
        errors: [
          {
            value: ssn,
            message: `Application<${type}> already exists for Issuer<${ssn}>`,
          },
        ],
      })
    }

    application = await applicationService.createApplication(
      issuer.ssn,
      type,
      state,
      data,
    )

    const title = 'Application created'
    const { authorSSN } = req.body
    await auditService.createAuditLog(state, title, authorSSN, application.id, {
      application: data,
    })

    return res.status(201).json({ application })
  },
)

router.get(
  '/:ssn/applications/:type',
  [
    param('ssn').isLength({ min: 10, max: 10 }),
    param('type').isIn(Object.values(consts.Types)),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { ssn, type } = req.params
    const issuer = await issuerService.getIssuer(ssn)
    if (!issuer) {
      return res.status(404).json({
        errors: [
          {
            value: ssn,
            message: `Issuer<${ssn}> not found`,
          },
        ],
      })
    }

    const application = await applicationService.getApplicationByIssuerAndType(
      ssn,
      type,
    )
    if (!application) {
      return res.status(404).json({
        errors: [
          {
            value: type,
            message: `Application<${type}> not found`,
          },
        ],
      })
    }

    return res.status(200).json({ application })
  },
)

export default router
