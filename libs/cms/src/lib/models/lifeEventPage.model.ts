import { ObjectType } from '@nestjs/graphql'
import { AnchorPage } from './anchorPage.model'

@ObjectType()
export class LifeEventPage extends AnchorPage {}
