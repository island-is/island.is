import { Field, InputType, Int } from "@nestjs/graphql";
import { GroupCreationDto, GroupUpdateDto } from '@island.is/clients/form-system'
import { CreateGroup, UpdateGroup } from "../models/group.model";


@InputType('FormSystemGetGroupInput')
export class GetGroupInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemCreateGroupInput')
export class CreateGroupInput {
  @Field(() => CreateGroup, { nullable: true })
  groupCreationDto?: GroupCreationDto
}

@InputType('FormSystemDeleteGroupInput')
export class DeleteGroupInput {
  @Field(() => Int)
  groupId!: number
}

@InputType('FormSystemUpdateGroupInput')
export class UpdateGroupInput {
  @Field(() => Int, { nullable: true })
  groupId!: number

  @Field(() => UpdateGroup, { nullable: true })
  groupUpdateDto?: GroupUpdateDto
}
