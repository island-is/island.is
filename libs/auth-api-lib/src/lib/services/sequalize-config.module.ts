import { Module } from '@nestjs/common'

export const SEQUELIZE_CONFIG = 'SequelizeConfig'
export interface SequalizeConfig {
  database: string
  username?: string
  password?: string
  dialect: string
  port?: number
}

@Module({
  providers: [
    {
      provide: SEQUELIZE_CONFIG,
      useValue: {
        database: '',
        dialect: 'postgres',
      } as SequalizeConfig,
    },
  ],
})
export class AppModule {}
