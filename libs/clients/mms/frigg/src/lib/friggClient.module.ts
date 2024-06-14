import { Module } from '@nestjs/common'
import { FriggClientService } from './friggClient.service'
import { apiProvider } from './apiProvider'

@Module({
  providers: [...apiProvider, FriggClientService],
  exports: [FriggClientService],
})
export class FriggClientModule {}
