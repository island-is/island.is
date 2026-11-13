import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DeviceRegistration } from './device-registration.model'
import { DeviceRegistrationsService } from './device-registrations.service'

@Module({
  imports: [SequelizeModule.forFeature([DeviceRegistration])],
  providers: [DeviceRegistrationsService],
  exports: [DeviceRegistrationsService],
})
export class DeviceRegistrationsModule {}
