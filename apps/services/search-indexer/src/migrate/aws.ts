import { ListDomainNamesResponse } from 'aws-sdk/clients/es'
import { logger } from '@island.is/logging'
import AWS from 'aws-sdk'
import { environment } from '../environments/environment'

class EsPackage {
  packageId: string
  dictLang: string
  dictType: string
  dictVersion: string
  packageName: string
  packagePrefix = ''

  static create(o): EsPackage {
    const ret = new EsPackage()
    ret.packageId = o.PackageID
    ret.packageName = o.PackageName
    const parts = ret.packageName.split('-')
    if (parts.length < 3) {
      return null
    }
    if (parts.length > 3) {
      ret.packagePrefix = parts.shift()
    }
    ret.dictLang = parts[0]
    ret.dictType = parts[1]
    ret.dictVersion = parts[2]
    return ret
  }
}

class PackageIds extends Map<string, EsPackage> {}

AWS.config.update({ region: environment.migrate.awsRegion })
export const awsEs = new AWS.ES()

export const checkAWSAccess = async () => {
  const domains: ListDomainNamesResponse = await awsEs
    .listDomainNames()
    .promise()

  logger.info('Validating esDomain agains aws domain list', domains)
  const hasDomain = domains.DomainNames.find(
    (domain) => domain.DomainName === environment.migrate.esDomain,
  )

  if (!hasDomain) {
    throw new Error('Domain not found')
  }
}

export const getAllPackageIdsForVersion = async (
  version: string,
): Promise<PackageIds> => {
  return awsEs
    .describePackages()
    .promise()
    .then((list) => {
      const ret: PackageIds = new PackageIds()
      list.PackageDetailsList.forEach((element) => {
        const t = EsPackage.create(element)
        logger.debug('Should add Version package?', {
          t: t,
          v: version,
          p: this.config.packagePrefix,
        })
        if (
          t &&
          t.dictVersion === version &&
          t.packagePrefix === this.config.packagePrefix
        ) {
          ret.set(t.dictType, t)
        }
      })
      return ret
    })
}
