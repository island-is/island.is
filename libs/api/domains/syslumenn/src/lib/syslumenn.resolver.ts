import {Args, Query, Resolver} from "@nestjs/graphql";
import {GetHomestaysInput} from "./dto/getHomestays.input";
import {Homestay} from "./models/homestay"
import {SyslumennService} from "./syslumenn.service";

@Resolver()
export class SyslumennResolver {
  constructor(private syslumennService: SyslumennService) {}

  @Query(() => [Homestay])
  getHomestays(
    @Args('input') input: GetHomestaysInput
  ): Promise<Homestay[]> {
    return this.syslumennService.getHomestays(input.year)
    /*return [
      {
        registrationNumber: "H222",
        address: "Hello",
        name: "Hooo",
        year: input.year,
        city: "Akureyri",
        manager: "ok"
      },
      {
        registrationNumber: "H222",
        address: "Hello",
        name: "Hooo",
        year: input.year,
        city: "Reykjavík",
        manager: "ok"
      }
    ]*/
  }
}
