import express from 'express'
import { body, validationResult } from 'express-validator'

import { Types } from './consts'
import * as applicationService from './service'

const router = express.Router()

router.post(
  '/',
  [
    body('ssn').isLength({ min: 10, max: 10 }),
    body('type').isIn(Object.values(Types)),
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

    const { ssn, type, data } = req.body
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

    application = await applicationService.createApplication(ssn, type, data)

    return res.status(201).json({ application })
  },
)

export default router
