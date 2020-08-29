import { Module, HttpModule } from '@nestjs/common';

@Module({
    imports: [HttpModule],
    exports: [HttpModule]
  })
  export class AuthZModule {}