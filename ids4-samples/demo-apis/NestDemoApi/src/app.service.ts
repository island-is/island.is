import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Congratulations, you successfully managed to call this function using island.is Identity Server as your entry point';
  }
}
