import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class XRoadGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const client = (req.headers['x-road-client'] ||
      req.headers['x_road_client']) as string

    if (!client) {
      throw new UnauthorizedException('Missing X-Road client header')
    }

    // Whitelist clients via env/config
    const allowed = (process.env.XROAD_ALLOWED_CLIENTS || '')
      .split(',')
      .map((s) => s.trim())
    if (allowed.length > 0 && !allowed.includes(client)) {
      throw new UnauthorizedException('Unauthorized X-Road client')
    }

    return true
  }
}
