import { GrantTypeService } from './grant-types.service';
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { GrantType } from './grant-type.model'
import { GrantTypeController } from './grant-types.controller';

@Module({
  imports: [SequelizeModule.forFeature([GrantType])],
  controllers: [GrantTypeController],
  providers: [GrantTypeService],
})
export class GrantTypesModule {}