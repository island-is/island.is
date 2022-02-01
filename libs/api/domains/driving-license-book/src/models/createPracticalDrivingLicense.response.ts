import { Field, ObjectType } from '@nestjs/graphql'


@ObjectType()
export class PracticalDrivingLessonId {
   @Field({nullable: true})
    id?: string | null
}

@ObjectType()
export class CreatePracticalDrivingLessonResponse {
   @Field(() => PracticalDrivingLessonId,{nullable: true})
    data?: PracticalDrivingLessonId
}