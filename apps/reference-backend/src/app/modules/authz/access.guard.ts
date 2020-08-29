import { Injectable, CanActivate, ExecutionContext, HttpService } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { environment } from '../../../environments'

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector, private httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest()

    const segments = request.url.split('/')
    const user = request.user

    let input = {
        method: request.method,
        path: [segments[1], segments[2]],
        natreg: user.natreg
    }

    var response = await this.httpService.post(environment.OPA_URI, { input: input} ).toPromise()

    return response.data.result.allow
  }
}