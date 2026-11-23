import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Client } from '../clients/models/client.model'
import { DeviceRegistration } from './device-registration.model'
import { DeviceRegistrationsService } from './device-registrations.service'

@Module({
  imports: [SequelizeModule.forFeature([DeviceRegistration, Client])],
  providers: [DeviceRegistrationsService],
  exports: [DeviceRegistrationsService],
})
export class DeviceRegistrationsModule {}
