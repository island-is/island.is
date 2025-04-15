import { Field, InputType } from '@nestjs/graphql'
import { ArrayMinSize, IsArray, IsOptional } from 'class-validator'

@InputType('WorkMachinesModelCategoriesInput')
export class GetWorkMachineModelCategoriesInput {
  @Field(() => [String], {
    description: 'What models to populate the categories of',
  })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  populateCategoriesForModels?: Array<string>
}
