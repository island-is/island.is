/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express'
import {
  commitCache,
  reserveCache,
  retrieveCache,
  uploadChunk,
} from './app/handlers'
import { healthCheck, livenessCheck } from './app/health'
import { authMiddleware } from './app/auth'
import { monkeyPatchServerLogging } from '@island.is/logging'

monkeyPatchServerLogging()

const app = express.default()

app.use(express.json())

// app.use((req, res, next) => {
//   logger.info(req.method, req.path)
//   logger.info('headers:', req.headers)
//   next()
// })
app.get('/health', healthCheck)
app.get('/liveness', livenessCheck)

app.use(authMiddleware)

app.get('/_apis/artifactcache/cache', retrieveCache)
app.post('/_apis/artifactcache/caches', reserveCache)
app.patch('/_apis/artifactcache/caches/:cacheId', uploadChunk)
app.post('/_apis/artifactcache/caches/:cacheId', commitCache)

app.use((req, res, next) => {
  console.log('Unknown request:', req.method, req.path, req.body)
  next()
})

const port = process.env.PORT || 3388
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)
