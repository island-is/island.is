import {
  buildMultiField,
  buildSection,
  buildRadioField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { priceList } from '../../../lib/messages/priceList'
import { checkForDiscount, formatIsk, getPriceList } from '../../../utils'
import { Application } from '@island.is/application/types'
import { Services } from '../../../shared/types'

export const PriceListSubSection = buildSection({
  id: Routes.PRICELIST,
  title: priceList.general.sectionTitle,
  children: [
    buildMultiField({
      id: `${Routes.PRICELIST}MultiField`,
      title: priceList.general.sectionTitle,
      description: priceList.general.description,
      children: [
        buildRadioField({
          id: `${Routes.PRICELIST}.priceChoice`,
          title: '',
          width: 'half',
          options: (application: Application) => {
            const hasDiscount = checkForDiscount(application)

            const applicationPrices = getPriceList(application)

            return [
              {
                label: !hasDiscount
                  ? {
                      id: priceList.labels.regularPriceTitle.id,
                      values: {
                        price:
                          applicationPrices.regularPrice?.priceAmount &&
                          formatIsk(
                            applicationPrices.regularPrice?.priceAmount,
                          ),
                      },
                    }
                  : {
                      id: priceList.labels.discountRegularPriceTitle.id,
                      values: {
                        price:
                          applicationPrices.regularDiscountPrice?.priceAmount &&
                          formatIsk(
                            applicationPrices.regularDiscountPrice?.priceAmount,
                          ),
                      },
                    },
                subLabel: priceList.labels.regularPriceDescription,
                value: Services.REGULAR,
              },
              {
                label: !hasDiscount
                  ? {
                      id: priceList.labels.fastPriceTitle.id,
                      values: {
                        price:
                          applicationPrices.fastPrice?.priceAmount &&
                          formatIsk(applicationPrices.fastPrice?.priceAmount),
                      },
                    }
                  : {
                      id: priceList.labels.discountFastPriceTitle.id,
                      values: {
                        price:
                          applicationPrices.fastDiscountPrice?.priceAmount &&
                          formatIsk(
                            applicationPrices.fastDiscountPrice?.priceAmount,
                          ),
                      },
                    },
                subLabel: priceList.labels.fastPriceDescription,
                value: Services.EXPRESS,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
