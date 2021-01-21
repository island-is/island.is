import {Args, Query, Resolver} from "@nestjs/graphql";
import {GetHomestaysInput} from "./dto/getHomestays.input";
import {Homestay} from "./models/homestay"
import {SyslumennService} from "./syslumenn.service";
import {environment} from "../../../cms/src/lib/environments";

const { cacheTime } = environment

const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class SyslumennResolver {
  constructor(private syslumennService: SyslumennService) {}

  @Directive(cacheControlDirective())
  @Query(() => [Homestay])
  getHomestays(
    @Args('input') input: GetHomestaysInput
  ): Promise<Homestay[]> {
    return this.syslumennService.getHomestays(input.year)
  }
}
