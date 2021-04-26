
import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { CreateApplication } from '@island.is/financial-aid/types'

@InputType()
export class CreateApplicationInput implements CreateApplication {

    @Allow()
    @Field()
    readonly nationalId!: string

    @Allow()
    @Field()
    readonly name!: string

    @Allow()
    @Field()
    readonly phoneNumber!: string

    @Allow()
    @Field()
    readonly email!: string
}
