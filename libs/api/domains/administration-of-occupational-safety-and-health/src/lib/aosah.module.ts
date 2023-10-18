import { TransferOfMachineOwnershipClientConfig, TransferOfMachineOwnershipClientModule } from "@island.is/clients/aosah/transfer-of-machine-ownership";
import { Module } from "@nestjs/common";
import { AosahApi } from "./aosah.service";
import { ConfigModule } from "@nestjs/config";
import { AosahResolver } from "./aosah.resolver";

@Module({
    imports: [
        TransferOfMachineOwnershipClientModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                TransferOfMachineOwnershipClientConfig
            ]
        })
    ],
    providers: [AosahResolver, AosahApi],
    exports: [AosahApi],
})
export class AosahModule {}