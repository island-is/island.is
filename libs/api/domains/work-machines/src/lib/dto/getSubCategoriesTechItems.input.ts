import { Field, InputType } from '@nestjs/graphql'
import { ArrayMinSize, IsArray, IsOptional } from 'class-validator'

@InputType('WorkMachinesSubCategoryTechInfoItemsInput')
export class GetWorkMachineSubCategoryTechInfoItemsInput {
  @Field(() => [String], {
    description: 'What subcategories to populate the tech info items of',
  })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  populateTechInfoItemsForSubCategories?: Array<string>
}
