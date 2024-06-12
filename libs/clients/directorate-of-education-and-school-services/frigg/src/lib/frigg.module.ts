import { Module } from '@nestjs/common'
import { FriggClientService } from './frigg.service'
import { KeyOptionsManagementApiProvider } from './apiProvider'

@Module({
  providers: [KeyOptionsManagementApiProvider, FriggClientService],
  exports: [FriggClientService],
})
export class FriggClientModule {}
