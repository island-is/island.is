import {SyslumennClient} from "./client/syslumenn.client";
import {Homestay, mapHomestay} from "./models/homestay";
import {Injectable} from "@nestjs/common";

@Injectable()
export class SyslumennService {
  constructor(private syslumennClient: SyslumennClient) {}

  async getHomestays(year: number) : Promise<Homestay[]> {
    const homestays = await this.syslumennClient.getHomestays(year)

    return (homestays ?? []).map(mapHomestay)
  }
}
