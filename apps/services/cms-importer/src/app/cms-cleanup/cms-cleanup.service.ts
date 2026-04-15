import { Injectable } from '@nestjs/common'
import { Asset } from 'contentful-management'
import { logger } from '@island.is/logging'
import { ManagementClientService } from '../repositories/cms/managementClient/managementClient.service'
import { ENVIRONMENT, LOCALE } from '../constants'

@Injectable()
export class CmsCleanupService {
  constructor(
    private readonly managementClientService: ManagementClientService,
  ) {}

  public async run() {
    logger.info('CMS cleanup worker starting...')

    logger.info(`Fetching all assets in ${ENVIRONMENT} environment...`)
    const allMasterAssets = await this.getAllAssets(ENVIRONMENT, true)
    logger.info(
      `Found ${allMasterAssets.length} assets in ${ENVIRONMENT} environment`,
    )

    const environments = await this.managementClientService.getEnvironments()
    if (!environments.ok) throw environments.error

    for (const environment of environments.data.items) {
      if (environment.sys.id === ENVIRONMENT) continue

      logger.info(`Checking ${environment.sys.id} environment...`)

      let skip = 0
      let total = Infinity
      const limit = 100

      let archiveCount = 0
      let countMatchWithMaster = 0
      let deleteCount = 0
      let updateCount = 0

      while (skip < total) {
        const assets = await this.managementClientService.getAssets(
          {
            limit,
            skip,
          },
          environment.sys.id,
        )
        if (!assets.ok) throw assets.error

        skip += limit
        total = assets.data.total

        // If master asset is archived, let's archive it also in other environments
        for (let asset of assets.data.items) {
          if (
            allMasterAssets.some(
              (masterAsset) =>
                masterAsset.sys.id === asset.sys.id &&
                masterAsset.isArchived() &&
                !asset.isArchived(),
            )
          ) {
            if (asset.isPublished() || asset.isUpdated())
              asset = await asset.unpublish()
            await asset.archive()
            logger.info(
              `Archived asset ${asset.sys.id} in ${environment.sys.id} environment`,
            )
            archiveCount++
          }

          // If assets in other environments are not in master, let's delete them
          if (
            allMasterAssets.some(
              (masterAsset) => masterAsset.sys.id === asset.sys.id,
            )
          )
            countMatchWithMaster++
          else {
            if (asset.isPublished() || asset.isUpdated())
              asset = await asset.unpublish()
            else if (asset.isDraft() && !asset.isArchived())
              asset = await asset.archive()
            await asset.delete()
            logger.info(
              `Deleted asset ${asset.sys.id} in ${environment.sys.id} environment`,
            )
            deleteCount++
          }

          // If assets in other environments are in master, let's update them if the file url is different
          for (const masterAsset of allMasterAssets) {
            if (masterAsset.sys.id === asset.sys.id) {
              if (masterAsset.isArchived()) continue
              const masterFileUrl = masterAsset.fields.file?.[LOCALE]?.url
              if (masterFileUrl) {
                let needsUpdate = false
                const assetFileUrl = asset.fields.file?.[LOCALE]?.url
                if (!assetFileUrl) needsUpdate = true
                else if (assetFileUrl !== masterFileUrl) needsUpdate = true

                if (needsUpdate) {
                  const wasPublished = asset.isPublished()
                  asset.fields.file = masterAsset.fields.file
                  asset = await asset.update()
                  if (wasPublished) await asset.publish()
                  logger.info(
                    `Asset ${asset.sys.id} updated in ${environment.sys.id} environment`,
                  )
                  updateCount++
                }
              }
            }
          }
        }
      }

      logger.info(
        `${countMatchWithMaster} assets in master environment matched with ${environment.sys.id} environment`,
      )
      logger.info(
        `${environment.sys.id} environment archived: ${archiveCount} assets`,
      )
      logger.info(
        `${environment.sys.id} environment deleted: ${deleteCount} assets`,
      )
      logger.info(
        `${environment.sys.id} environment updated: ${updateCount} assets`,
      )
    }

    logger.info('CMS cleanup worker finished.')
  }

  private async getAllAssets(environment: string, logProgress = false) {
    let skip = 0
    let total = Infinity
    const limit = 500
    const assets: Asset[] = []

    while (skip < total) {
      const response = await this.managementClientService.getAssets(
        {
          limit,
          skip,
        },
        environment,
      )
      if (!response.ok) throw response.error
      skip += limit
      total = response.data.total
      if (logProgress)
        logger.info(`Fetched ${skip < total ? skip : total}/${total} assets...`)

      assets.push(...response.data.items)
    }

    return assets
  }
}
