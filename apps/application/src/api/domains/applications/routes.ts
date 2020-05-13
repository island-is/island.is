import { Router } from 'express'
import { body, validationResult } from 'express-validator'

import { States, Types } from './consts'
import * as applicationService from './service'

const router = Router()

router.post(
  '/',
  [
    body('ssn').isLength({ min: 10, max: 10 }),
    body('type').isIn(Object.values(Types)),
    body('state')
      .optional()
      .customSanitizer((value) => value || States.PENDING)
      .isIn(Object.values(States)),
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

    const { ssn, type, state, data } = req.body
    let application = await applicationService.getApplicationByIssuerAndType(
      ssn,
      type,
    )
    if (application) {
      return res.status(400).json({
        errors: [
          {
            value: ssn,
            msg: `Application<${type}> already exists for Issuer<${ssn}>`,
          },
        ],
      })
    }

    application = await applicationService.createApplication(
      ssn,
      type,
      state,
      data,
    )

    return res.status(201).json({ application })
  },
)

export default router
