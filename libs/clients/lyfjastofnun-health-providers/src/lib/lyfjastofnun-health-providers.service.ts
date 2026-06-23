import { Injectable } from '@nestjs/common'

import {
  Laeknastod,
  Lyfjabud,
  LyfjaUtibu,
  Lyfjaheildsala,
  getApiV1EftirlitLaeknastodvar,
  getApiV1EftirlitLyfjabudir,
  getApiV1EftirlitLyfjaheildsolur,
} from '../../gen/fetch'

import {
  LicensedOperationOperator,
  MedicalClinic,
  Pharmacy,
  PharmacyBranch,
  Wholesaler,
} from './types'

const mapOperator = (
  dto: Pick<
    Lyfjabud | Laeknastod,
    | 'rekstraradili'
    | 'rek_Gotuheiti1'
    | 'rek_Postnumer'
    | 'rek_Poststod'
    | 'rek_Simi'
    | 'rek_Kennitala'
  >,
): LicensedOperationOperator | undefined => {
  if (!dto.rekstraradili) return undefined
  return {
    name: dto.rekstraradili,
    address: dto.rek_Gotuheiti1 ?? undefined,
    postalCode: dto.rek_Postnumer ?? undefined,
    city: dto.rek_Poststod ?? undefined,
    phone: dto.rek_Simi ?? undefined,
    nationalId: dto.rek_Kennitala ?? undefined,
  }
}

const mapBranch = (dto: LyfjaUtibu): PharmacyBranch | undefined => {
  if (!dto.nafn) return undefined
  return {
    name: dto.nafn,
    address: dto.gotuheiti ?? undefined,
    postalCode: dto.postnumer ?? undefined,
    city: dto.poststod ?? undefined,
    phone: dto.simi ?? undefined,
    fax: dto.fax ?? undefined,
    email: dto.netfang ?? undefined,
    category: dto.flokkur ?? undefined,
  }
}

const mapPharmacy = (dto: Lyfjabud): Pharmacy | undefined => {
  if (!dto.nafn) return undefined
  return {
    name: dto.nafn,
    address: dto.gotuheiti1 ?? undefined,
    postalCode: dto.postnumer ?? undefined,
    city: dto.poststod ?? undefined,
    phone: dto.simi ?? undefined,
    fax: dto.fax ?? undefined,
    email: dto.netfang ?? undefined,
    nationalId: dto.kennitala ?? undefined,
    licenseHolder: dto.lyfsoluleyfishafi ?? undefined,
    onlineStore: dto.netverslun ?? undefined,
    operator: mapOperator(dto),
    branches: (dto.utibu ?? [])
      .map(mapBranch)
      .filter((b): b is PharmacyBranch => b !== undefined),
  }
}

const mapMedicalClinic = (dto: Laeknastod): MedicalClinic | undefined => {
  if (!dto.nafn) return undefined
  return {
    name: dto.nafn,
    address: dto.gotuheiti1 ?? undefined,
    postalCode: dto.postnumer ?? undefined,
    city: dto.poststod ?? undefined,
    phone: dto.simi ?? undefined,
    fax: dto.fax ?? undefined,
    email: dto.netfang ?? undefined,
    nationalId: dto.kennitala ?? undefined,
    operator: mapOperator(dto),
  }
}

const mapWholesaler = (dto: Lyfjaheildsala): Wholesaler | undefined => {
  if (!dto.nafn) return undefined
  return {
    name: dto.nafn,
    address: dto.gotuheiti1 ?? undefined,
    postalCode: dto.postnumer ?? undefined,
    city: dto.poststod ?? undefined,
    phone: dto.simi ?? undefined,
    fax: dto.fax ?? undefined,
    email: dto.netfang ?? undefined,
    nationalId: dto.kennitala ?? undefined,
  }
}

@Injectable()
export class LyfjastofnunHealthProvidersClientService {
  public getPharmacies = async (): Promise<Pharmacy[]> => {
    const { data, error } = await getApiV1EftirlitLyfjabudir()
    if (error) throw error
    return (data ?? []).map(mapPharmacy).filter((p): p is Pharmacy => p !== undefined)
  }

  public getMedicalClinics = async (): Promise<MedicalClinic[]> => {
    const { data, error } = await getApiV1EftirlitLaeknastodvar()
    if (error) throw error
    return (data ?? []).map(mapMedicalClinic).filter((c): c is MedicalClinic => c !== undefined)
  }

  public getWholesalers = async (): Promise<Wholesaler[]> => {
    const { data, error } = await getApiV1EftirlitLyfjaheildsolur()
    if (error) throw error
    return (data ?? []).map(mapWholesaler).filter((w): w is Wholesaler => w !== undefined)
  }
}
