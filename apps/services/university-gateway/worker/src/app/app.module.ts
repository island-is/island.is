import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { AppService } from './app.service'
import { appModuleConfig } from './app.config'

@Module({
  imports: [ConfigModule.forRoot({ load: [appModuleConfig] })],
  providers: [AppService],
})
export class AppModule {}
