import { logger } from '@island.is/logging'
import { environment, } from '../environments/environment'
import * as aws from './aws'
import * as dictionary from './dictionary'
import * as elastic from './elastic'


class App {
  async run() {
    logger.info('Starting migration of dictionaries and ES config', environment.migrate)

    const hasAwsAccess = await aws.checkAWSAccess()

    let packageIds: aws.AwsEsPackage[]
    if (hasAwsAccess) {
      packageIds = await this.migrateAws()
    } else {
      logger.info('No aws access found running in local development mode')
      // get packageId list for local development packages have package ids matching filenames in the dictionary repo
      packageIds = dictionary.getFakePackageIds()
    }

    await this.migrateES(packageIds)

    if (hasAwsAccess) {
      logger.info('Cleaning up unused packages')
      // TODO: Get permission in AWS to do this
      // await aws.disassociatePackagesFromAwsEs(packageIds) // we disassociate all but the files in packageIds
      // await aws.deletePackagesFromAwsEs(packageIds) // we delete all but the files in packageIds
    }
    logger.info('Done!')
  }

  private async migrateAws() {
    const repoDictionaryVersion = await dictionary.getDictionaryVersion()
    const awsDictionaryVersion = await aws.getDictionaryVersion()
    // we only try to update teh dictionary files if we find a missmatch in version numbers
    if (repoDictionaryVersion !== awsDictionaryVersion) {
      logger.info('Dictionary version missmatch, updating dictionary', { repoVersion: repoDictionaryVersion, awsVersion: awsDictionaryVersion })
      const dictionaries = await dictionary.getDictionaryFiles() // get files form dictionary repo
      const uploadedS3Files = await aws.updateS3DictionaryFiles(dictionaries) // upload repo files to s3
      const esPackages = await aws.createAwsEsPackages(uploadedS3Files, repoDictionaryVersion) // create packages for the new files in AWS ES
      await aws.associatePackagesWithAwsEs(esPackages) // attach the new packages to our AWS ES instance
      await aws.updateDictionaryVersion(repoDictionaryVersion) // update version file last to ensure process runs again on failure
      return esPackages // es config needs the package ids when generating the index template
    } else {
      logger.info('No need to update dictionary, getting current package ids')
      return aws.getAllDomainEsPackages()
    }
  }

  private async migrateES(packageIds: aws.AwsEsPackage[]) {
    await elastic.checkAccess() // this throws if there is no connection hence ensuring we dont continue
    // TODO: Do we need to update index templates?
    // TODO: Do we need to update index alias?

    // const hasVersion = await this.esHasVersion(codeVersion)
    /* if(hasVersion)
      if (!(await this.aliasIsCorrect(codeVersion))) {
        logger.info('Alias is not correct')
        await this.fixAlias(codeVersion)
        logger.info('Alias was fixed')
        return
      }
    */
    /*
      const config = this.createConfig(packageIds)
      logger.info('Updating index template', { codeVersion, packageIds, config })
      return this.createTemplate(config).then(() =>
        this.reindexToNewIndex(codeVersion),
      )
    */
    logger.info('Starting ES migration', { packageIds })
    logger.info('Ran!')
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
