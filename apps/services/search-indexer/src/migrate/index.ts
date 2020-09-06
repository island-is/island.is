import { logger } from '@island.is/logging'
import { environment, } from '../environments/environment'
import * as aws from './aws'
import * as dictionary from './dictionary'
import { AwsEsPackage } from './aws'

class App {
  async run() {
    logger.info('Starting migration if needed', environment.migrate)
    const hasAwsAccess = await aws.checkAWSAccess()

    let packageIds: AwsEsPackage[]
    if (hasAwsAccess) {
      packageIds = await this.migrateAws()
    } else {
      // get "fake" packageId list for local development
      packageIds = dictionary.getFakePackageIds()
    }

    await this.migrateES(packageIds)

    if (hasAwsAccess) {
      // TODO: Get permission in AWS to do this
      // await aws.disassociatePackagesFromAwsEs(packageIds) // we disassociate all but the files in packageIds
      // await aws.deletePackagesFromAwsEs(packageIds) // we delete all but the files in packageIds
    }
    logger.info('Done!')
  }

  private async migrateAws() {
    const repoDictionaryVersion = await dictionary.getDictionaryVersion()
    const awsDictionaryVersion = await aws.getDictionaryVersion()
    if (repoDictionaryVersion !== awsDictionaryVersion) {
      logger.info('Dictionary version missmatch, updating dictionary', { repoVersion: repoDictionaryVersion, awsVersion: awsDictionaryVersion })
      const dictionaries = await dictionary.getDictionaryFiles() // get files form dictionary repo
      const uploadedS3Files = await aws.updateS3DictionaryFiles(dictionaries) // upload repo files to s3
      const packageIds = await aws.createAwsEsPackages(uploadedS3Files, repoDictionaryVersion) // create packages for the new files in AWS ES
      await aws.associatePackagesWithAwsEs(packageIds) // attach the new packages to our AWS ES instance
      await aws.updateDictionaryVersion(repoDictionaryVersion) // update version file last to ensure process runs again on failure
      return packageIds // es config needs the package ids when generating the index template
    } else {
      logger.info('no need to update dictionary, getting current package ids')
      // TODO: Get all package ids here and return <- next
    }
  }

  private async migrateES(packageIds: AwsEsPackage[]) {
    return true
  }
}

async function migrateBootstrap() {
  const app = new App()
  await app.run()
}

migrateBootstrap().catch((error) => {
  logger.error('ERROR: ', error)
  // take down container on error
  throw error
})
