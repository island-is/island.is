import { IsString, IsNotEmpty } from 'class-validator'

export class PrimarySchoolAssignmentResultParamsDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string

  @IsString()
  @IsNotEmpty()
  assignmentResultId!: string
}
