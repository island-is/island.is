import jwt from 'jsonwebtoken'
import decode from 'jwt-decode'
import { ExecutionContext } from '@nestjs/common'
import { environment } from '../../../../environments'

export function verifyToken<T>(token: string): T | null {
  try {
    const decoded = (jwt.verify(
      token,
      environment.templateApi.jwtSecret,
    ) as unknown) as T
    return decoded
  } catch (e) {
    return null
  }
}
