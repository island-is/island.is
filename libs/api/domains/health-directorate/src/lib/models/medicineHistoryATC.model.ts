import { Field, ObjectType } from '@nestjs/graphql'
import { MedicineHistoryDispensation } from './medicineHistory.model'

@ObjectType('HealthDirectorateMedicineDispensationsATC')
export class MedicineDispensationsATC {
  @Field(() => [MedicineHistoryDispensation])
  dispensations!: MedicineHistoryDispensation[]
}
