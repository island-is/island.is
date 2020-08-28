import '@island.is/infra-tracing'
import { DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app/app.module'
import { bootstrap } from '@island.is/infra-nest-server'

bootstrap({
  appModule: AppModule,
  name: 'air-discount-scheme-backend',
  port: 4248,
  swaggerPath: 'api/swagger',
  openApi: new DocumentBuilder()
    .setTitle('Air Discount Scheme')
    .setDescription(
      `
      This documentation is provided to airline booking sites for
      integration purposes.

      WARNING: While you are developing this integration the Discounts
      endpoint POST /api/public/users/{nationalId}/discounts is
      available to create a discount for any national id. We will
      remove it when we go live. This functionality of creating
      discounts should only be available to the user who is registered
      for it.

      If there exists an ID attribute on any object, that ID refers
      to a unique identifier of the object it is in. If the object
      has an additional ID, something like flightId that refers to
      an unique identifier of an object that is related to the
      current one.

      The flow is like this:

        1.  First create a discount through the
            POST /api/public/users/{nationalId}/discounts endpoint.
            Any valid nationalId will work. Notice the warning above
            about this endpoint.


        2.  Use the discount to book a flight on your end:

          2a. First you need to fetch the user that is registered to this
              discountCode by calling
              GET /api/public/discounts/{discountCode}/user.
              This endpoint will return user specific information that
              should be populated on your booking page and made readonly
              so the user can not change it.

          2b. Then you can create a flight. A flight contains all the
              relevant information about the booking from the customer.
              Use POST /api/public/discounts/{discountCode}/flights.
              When this endpoint is used the discountCode is
              invalidated, so the user can not use it and needs
              to generate a new discountCode (step 1).


        3.  When you have created a flight you have the possibility
            to delete it. For example if a payment failure has
            occurred. You can use the ID that you received when
            creating the flight to delete it. You have two possibilities:

          3a. You can either delete all related flightLegs that were
              booked by calling
              DELETE /api/public/flights/{flightId}

          3b. Or delete specific flightLegs within the booking by:

            3ba. First fetching the related flightLegs by calling
                 GET /api/public/flights/{flightId}

            3bb. Then use the flightLeg IDs from "3ba." result
                 to delete the desired flightLegs by calling
                 DELETE /api/public/flights/{flightId}/flightLegs/{flightLegId}
    `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build(),
})
