import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AwsModule } from '@island.is/nest/aws'
import { CmsModule } from '@island.is/cms'
import { SitemapGeneratorModule } from './modules/sitemap-generator/sitemap-generator.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AwsModule,
    CmsModule,
    SitemapGeneratorModule,
  ],
})
export class AppModule {}
