import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TestimonyType } from './models/testimonyType.model'
import { OrganizationTestimonyType } from './models/organizationTestimonyType.model'

@Module({
  imports: [
    SequelizeModule.forFeature([TestimonyType, OrganizationTestimonyType]),
  ],
})
export class TestimoniesModule {}
