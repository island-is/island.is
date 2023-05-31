import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import { CreateCourseDto } from './createCourseDto'

export class UpdateCourseDto extends CreateCourseDto {}
