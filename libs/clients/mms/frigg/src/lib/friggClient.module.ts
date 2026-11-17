import { Module } from '@nestjs/common'
import { FriggClientService } from './friggClient.service'
import { FriggKeyInfoClientService } from './friggKeyInfo.service'
import { apiProvider } from './apiProvider'

@Module({
  providers: [...apiProvider, FriggClientService, FriggKeyInfoClientService],
  exports: [FriggClientService, FriggKeyInfoClientService],
})
export class FriggClientModule {}
