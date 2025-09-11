import { MedmaeliBulkResponseDTO } from '../../../gen/fetch'

export interface NationalIds {
  nationalId: string
  reason?: string
}

export interface BulkUpload {
  success: NationalIds[]
  failed: NationalIds[]
}

export const mapBulkResponse = (
  signatures: MedmaeliBulkResponseDTO,
): BulkUpload => ({
  success:
    signatures.medmaeliKenn?.map((nationalId) => ({
      nationalId,
    })) ?? [],
  failed: [
    ...(signatures.medMedmaeliAnnarListi?.map((nationalId) => ({
      nationalId,
      reason: 'Þegar meðmæli á öðrum lista',
    })) ?? []),
    ...(signatures.medMedmaeliALista?.map((nationalId) => ({
      nationalId,
      reason: 'Þegar meðmæli á þessum lista',
    })) ?? []),
    ...(signatures.notFound?.map((nationalId) => ({
      nationalId,
      reason: 'Kennitala fannst ekki',
    })) ?? []),
    ...(signatures.undirAldri?.map((nationalId) => ({
      nationalId,
      reason: 'Undir Aldri',
    })) ?? []),
    ...(signatures.ekkiASvaedi?.map((nationalId) => ({
      nationalId,
      reason: 'Ekki á svæði',
    })) ?? []),
    ...(signatures.ekkiIsRik?.map((nationalId) => ({
      nationalId,
      reason: 'Ekki með íslenskt ríkisfang',
    })) ?? []),
    ...(signatures.ekkiBuseta?.map((nationalId) => ({
      nationalId,
      reason: 'Ekki með íslenska búsetu',
    })) ?? []),
  ],
})

export const getReasonKeyForPaperSignatureUpload = (
  bulkResponse: MedmaeliBulkResponseDTO,
  nationalId: string,
) => {
  const listMapping: { [key in keyof MedmaeliBulkResponseDTO]?: string } = {
    notFound: 'Kennitala fannst ekki',
    undirAldri: 'Undir Aldri',
    ekkiIsRik: 'Ekki með íslenskt ríkisfang',
    ekkiBuseta: 'Ekki með íslenska búsetu',
    ekkiASvaedi: 'Ekki á svæði',
    medMedmaeliALista: 'Þegar meðmæli á þessum lista',
    medMedmaeliAnnarListi: 'Þegar meðmæli á öðrum lista',
  }

  for (const [key, reason] of Object.entries(listMapping)) {
    const list = bulkResponse[key as keyof MedmaeliBulkResponseDTO] as
      | Array<string>
      | undefined
    if (list?.includes(nationalId)) {
      return [reason]
    }
  }
  return []
}
