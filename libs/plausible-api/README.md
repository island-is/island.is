# Plausible Analytics Service

## About
This library defines a Plausible Analytics service that utilizes NestJS's HttpService (which is based on Axios). The service allows its users to send events to Plausible Analytics on behalf of their application.

## NestJS Module
First, create a `PlausibleModule` and add the `PlausibleService` to the module's providers:

```typescript
import { Module, HttpModule } from '@nestjs/common';
import { PlausibleService } from './plausible.service';

@Module({
  imports: [HttpModule],
  providers: [PlausibleService],
  exports: [PlausibleService],
})
export class PlausibleModule {}
```

Then, import the `PlausibleModule` into your main application module:

```typescript
import { PlausibleModule } from './plausible/plausible.module';

@Module({
  imports: [PlausibleModule],
})
export class AppModule {}
```

## Usage
Inject the `PlausibleService` into your class and call the `sendEvent` method with your event data and headers:

```typescript
import { PlausibleService } from './plausible/plausible.service';

class SomeClass {
  constructor(private plausibleService: PlausibleService) {}

  async sendCustomEvent() {
    const event = {
      name: 'custom-event',
      url: 'http://example.com',
      domain: 'example.com',
    };
    const headers = {
      'user-agent': 'Your User Agent',
      'x-forwarded-for': 'Your IP Address',
    };

    try {
      const response = await this.plausibleService.sendEvent(event, headers);
      console.log('Event sent successfully:', response);
    } catch (error) {
      console.error('Error sending event:', error);
    }
  }
}
```

## Code owners and maintainers
Norda
