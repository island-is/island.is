import * as express from 'express'

export const healthCheck = async (_: any, res: express.Response) => {
  res.send('OK')
}

export const livenessCheck = async (_: any, res: express.Response) => {
  res.send('OK')
}
