import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class PlausibleService {
  constructor(private httpService: HttpService) {}

  async sendEvent(
    event: {
      url: string
      name: string
      params?: Record<string, string | number | boolean>
    },
    headers: Record<string, string>,
  ) {
    const url = 'https://plausible.io/api/event'
    const plausibleHeader = {
      'User-Agent': headers['userAgent'],
      'X-Forwarded-For': headers['xForwardedFor'],
      'Content-Type': 'application/json',
    }

    const eventData = {
      ...event,
      ...(event.params && { props: { ...event.params } }),
    }

    console.log('Sending event to Plausible:', eventData)

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, eventData, { headers: plausibleHeader }),
      )
      return response.data
    } catch (error) {
      console.error('Error sending event to Plausible:', error)
      throw error
    }
  }
}
