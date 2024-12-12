import { Resolver } from '@nestjs/graphql'
import { VerdictsService } from './verdicts.service'

@Resolver()
export class VerdictsResolver {
  constructor(private readonly verdictsService: VerdictsService) {}
}
