import { Module } from '@nestjs/common'
import { RegulationsClientModule } from '@island.is/clients/regulations'

@Module({
  imports: [RegulationsClientModule],
})
export class RegulationsModule {}
