import * as express from 'express'
import { cache } from './external'

export const healthCheck = async (_: any, res: express.Response) => {
  res.send('OK')
}

export const livenessCheck = async (_: any, res: express.Response) => {
  const ping = await cache.ping()
  if (ping) {
    res.send('OK')
  } else {
    res.status(500).send('Cache ping failed')
  }
}
