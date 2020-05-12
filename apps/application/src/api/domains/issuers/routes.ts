import express from 'express'
import { body, validationResult } from 'express-validator'

import * as issuerService from './service'

const router = express.Router()

router.post(
  '/',
  [body('ssn').isLength({ min: 10, max: 10 })],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { ssn } = req.body
    let issuer = await issuerService.getIssuer(ssn)
    if (issuer) {
      return res.status(400).json({
        errors: [{ value: ssn, msg: `Issuer<${ssn}> already exists!` }],
      })
    }

    issuer = await issuerService.createIssuer(ssn)

    return res.status(201).json({ issuer })
  },
)

export default router
