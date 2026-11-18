import { Module } from '@nestjs/common'

import { DeviceRegistrationsModule as AuthDeviceRegistrationsModule } from '@island.is/auth-api-lib'

import { DeviceRegistrationsController } from './device-registrations.controller'

@Module({
  imports: [AuthDeviceRegistrationsModule],
  controllers: [DeviceRegistrationsController],
})
export class DeviceRegistrationsModule {}
