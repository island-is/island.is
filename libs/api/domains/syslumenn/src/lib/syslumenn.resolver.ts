import {Args, Query, Resolver} from "@nestjs/graphql";
import {GetHomestaysInput} from "./dto/getHomestays.input";
import {Homestay} from "./models/homestay"

@Resolver()
export class SyslumennResolver {
  @Query(() => [Homestay])
  getHomestays(
    @Args('input') input: GetHomestaysInput
  ):Homestay[] {
    return [
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
    ]
  }
}
