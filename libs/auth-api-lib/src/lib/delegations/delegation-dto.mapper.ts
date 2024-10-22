import { DelegationRecordDTO } from './dto/delegation-index.dto'
import { DelegationDTO } from './dto/delegation.dto'
import { MergedDelegationDTO } from './dto/merged-delegation.dto'

export class DelegationDTOMapper {
  public static toMergedDelegationDTO(dto: DelegationDTO): MergedDelegationDTO {
    return {
      fromName: dto.fromName,
      fromNationalId: dto.fromNationalId,
      toNationalId: dto.toNationalId,
      toName: dto.toName,
      validTo: dto.validTo,
      types: [dto.type],
      scopes: dto.scopes,
    }
  }

  public static recordToMergedDelegationDTO(
    dto: DelegationRecordDTO,
  ): MergedDelegationDTO {
    return {
      fromNationalId: dto.fromNationalId,
      toNationalId: dto.toNationalId,
      types: [dto.type],
    }
  }
}
