import { MedmaeliBulkResponseDTO } from '../../../gen/fetch'

export interface NationalIds {
  nationalId: string
  reason?: string
}

export interface BulkUpload {
  success: NationalIds[]
  failed: NationalIds[]
}

export function mapBulkResponse(
  signatures: MedmaeliBulkResponseDTO,
): BulkUpload {
  return {
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
        reason: 'Þegar meðmæli á lista',
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
    ],
  }
}
