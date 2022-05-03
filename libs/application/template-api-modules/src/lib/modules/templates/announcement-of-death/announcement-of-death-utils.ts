import { join } from 'path'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { SkraningaradiliDanarbusSkeyti } from '../../../../../../../clients/syslumenn/gen/fetch'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/parental-leave/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./parental-leave-assets/${file}`)
}

export const baseMapper = (entity: object): object => {
  return {
    ...entity,
    initial: true,
  }
}

export const relationMapper = (relation: string): string => {
  relation = relation.toLowerCase()
  switch (relation) {
    case 'barn':
      return 'child'
    case 'maki':
      return 'spouse'
    case 'bróðir':
    case 'systir':
    case 'systkini':
      return 'sibling'
    case 'faðir':
    case 'móðir':
    default:
      return 'parent'
  }
}

export const estateMemberMapper = (estateRaw: any): object => {
  return baseMapper({
    name: estateRaw.nafn ?? '',
    nationalId: estateRaw.kennitala ?? '',
    relation: relationMapper(estateRaw.tegundTengsla),
  })
}

export const assetMapper = (assetRaw: any): object => {
  return baseMapper({
    description: assetRaw.lysing ?? '',
    assetNumber: assetRaw.fastanumer ?? '',
    share: assetRaw.eignarhlutfall ?? 1,
  })
}

export const estateMapper = (
  syslaData: SkraningaradiliDanarbusSkeyti,
): object => {
  return {
    applicantEmail: syslaData.tolvuposturSkreningaradila ?? '',
    applicantPhone: syslaData.simiSkraningaradila ?? '',
    knowledgeOfOtherWills: syslaData.vitneskjaUmAdraErfdaskra ? 'yes' : 'no',
    assets: syslaData.eignir
      ? syslaData.eignir.filter((a) => a.tegundAngalgs === 0).map(assetMapper)
      : [],
    vehicles: syslaData.eignir
      ? syslaData.eignir.filter((a) => a.tegundAngalgs === 1).map(assetMapper)
      : [],
    estateMembers: syslaData.adilarDanarbus
      ? syslaData.adilarDanarbus.map(estateMemberMapper)
      : [],
    marriageSettlement: syslaData.kaupmaili ?? false,
    office: syslaData.embaetti ?? '',
    caseNumber: syslaData.malsnumer ?? '',
    dateOfDeath: syslaData.danardagur ?? '',
    nameOfDeceased: syslaData.nafnLatins ?? '',
    ownBusinessManagement: syslaData.eiginRekstur ?? false,
    assetsAbroad: syslaData.eignirErlendis ?? false,
    occupationRightViaCondominium:
      syslaData.buseturetturVegnaKaupleiguIbuda ?? false,
    bankStockOrShares: syslaData.bankareikningarVerdbrefEdaHlutabref ?? false,
  }
}
