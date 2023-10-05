import { Module } from "@nestjs/common";
import { AosahApiProvider } from "./aosahClient.service";

@Module({
    providers: [
        AosahApiProvider
    ],
    exports: [
        AosahApiProvider
    ],
})
export class AosahClientModule {}