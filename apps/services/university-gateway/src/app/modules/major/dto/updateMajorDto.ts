import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import { CreateMajorDto } from './createMajorDto'

export class UpdateMajorDto extends CreateMajorDto {}
