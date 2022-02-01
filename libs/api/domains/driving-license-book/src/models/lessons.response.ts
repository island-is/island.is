import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class Lesson {
    @Field({nullable: true})
    id?: string | null
    
    @Field({nullable: true})
    registerDate?: string | null
    
    @Field({nullable: true})
    lessonTime?: number
    
    @Field({nullable: true})
    teacherSsn?: string | null
    
    @Field({nullable: true})
    teacherName?: string | null
    
    @Field({nullable: true})
    comments?: string | null
}