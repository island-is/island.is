import * as express from 'express'
import environment from '../environments/environment'
import { logger } from '@island.is/logging'
import {
  error,
  getContentInfo,
  uploadChunkStream,
  getCacheId,
  GetContentInfoError,
} from './utils'
import { cache, s3 } from './external'

const { bucket } = environment

export const reserveCache = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { version, key } = req.body
  const cacheId = getCacheId(key, version)
  const objectParams = {
    Bucket: bucket,
    Key: cacheId,
  }
  try {
    logger.debug(`Reserving cache id ${cacheId}`)
    const reservation = await cache.setKeyIfNotExists(
      cacheId,
      'cacheId',
      version,
    )
    logger.debug(`Reservation: ${reservation}`)
    if (reservation !== 1) {
      return error(res, 'cache id already reserved', 409)
    }
    logger.debug(`Creating multipartupload for ${cacheId}`)
    const { UploadId } = await s3.createMultipartUpload(objectParams).promise()
    if (!UploadId) {
      throw new Error('No upload id received from createMultipartUpload')
    }
    logger.info(`Adding uploadId as ${UploadId} to ${cacheId}`)
    await cache.setKey(cacheId, 'uploadId', UploadId)
    res.send({ cacheId })
  } catch (e) {
    next(e)
  }
}

export const uploadChunk = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { cacheId } = req.params
  logger.debug(`Uploading chunk for ${cacheId}`)
  const uploadId = await cache.getKey(cacheId, 'uploadId')
  if (!uploadId) {
    return error(res, `cache id ${cacheId} not found!`, 404)
  }
  try {
    const { contentLength, partNumber } = getContentInfo(req)
    logger.info(
      `Uploading ${contentLength} bytes for part number ${partNumber}`,
    )
    const { writeStream, promise } = uploadChunkStream(
      s3,
      bucket,
      uploadId,
      cacheId,
      contentLength,
      partNumber,
    )
    logger.debug('Piping data...')
    req.pipe(writeStream)
    const uploadData = await promise
    logger.debug(`Upload data: `, uploadData)
    await cache.setKey(
      cacheId,
      `part-${partNumber - 1}`,
      JSON.stringify({
        ETag: uploadData.ETag,
        PartNumber: partNumber,
      }),
    )
  } catch (e) {
    if (e instanceof GetContentInfoError) {
      console.warn('Error in part upload', e)
      return error(res, `could not get content info: ${e.message}`, 400)
    }
    return next(e)
  }
  res.sendStatus(200)
}

export const commitCache = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { cacheId } = req.params
  logger.debug(`Finalizing cache upload for ${cacheId}`)
  const uploadInfo = await cache.getMap(cacheId)
  const uploadId = uploadInfo.uploadId
  logger.debug(`Upload id: ${uploadId}`)
  if (!uploadId) {
    return error(res, `cache id ${cacheId} not found!`, 404)
  }
  const uploadMap: string[] = []
  Object.entries(uploadInfo).forEach(([key, value]) => {
    logger.debug(`key: ${key}, value: ${value}`)
    if (key.startsWith('part-')) {
      const index = parseInt(key.replace(/^part-/, ''), 10)
      logger.debug(`Got index ${index} from key`)
      uploadMap[index] = value
    }
  })
  const MultipartUpload = {
    Parts: uploadMap.map((item) => JSON.parse(item)),
  }
  logger.debug(`Completing multipartupload with map`, MultipartUpload)
  await s3
    .completeMultipartUpload({
      Bucket: bucket,
      Key: cacheId,
      MultipartUpload,
      UploadId: uploadId,
    })
    .promise()
  cache.expire(cacheId, 1)
  res.sendStatus(200)
}

export const retrieveCache = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  logger.debug('Query: ', req.query)
  const { version, keys } = req.query
  if (!keys || !version) {
    return error(res, 'Missing required parameters version and keys', 400)
  }
  const cacheId = getCacheId(keys as string, version as string)
  logger.info(`Retrieving cache id ${cacheId}`)
  const objectParams = {
    Bucket: bucket,
    Key: cacheId,
  }
  try {
    const h = await s3.headObject(objectParams).promise()
  } catch (e) {
    return error(res, `Cache entry ${cacheId} not found!`, 404)
  }
  try {
    const signedUrl = await s3.getSignedUrlPromise('getObject', {
      ...objectParams,
      Expires: 60,
    })
    logger.info(`Signed url: ${signedUrl}`)
    res.send({ archiveLocation: signedUrl, cacheKey: keys as string })
  } catch (e) {
    logger.error('Error creating signed url', e)
    next(e)
  }
}
