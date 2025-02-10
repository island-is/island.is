import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export class MetadataAbstractor {
  constructor(
    private readonly reflector: Reflector,
    private readonly context: ExecutionContext,
  ) {}

  public getMetadataIfExists = <T>(key: string): T | null => {
    const reflectorData = this.reflector.getAllAndOverride<T>(key, [
      this.context.getHandler(),
      this.context.getClass(),
    ])
    return reflectorData ?? null
  }
}
