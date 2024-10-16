import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { expect, Page } from '@playwright/test'
import { label } from '../../../../../support/i18n'
import { helpers } from '../../../../../support/locator-helpers'

export const fillApplicantInfo = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(
        socialInsuranceAdministrationMessage.info.infoSubSectionTitle,
      ),
    }),
  ).toBeVisible()

  const phoneNumber = page.getByRole('textbox', {
    name: label(socialInsuranceAdministrationMessage.info.applicantPhonenumber),
  })
  await phoneNumber.selectText()
  await phoneNumber.fill('6555555')
  await proceed()
}

export const fillPaymentInfo = async (page: Page, includeTax: boolean) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(socialInsuranceAdministrationMessage.payment.title),
    }),
  ).toBeVisible()
  const paymentBank = page.getByRole('textbox', {
    name: label(socialInsuranceAdministrationMessage.payment.bank),
  })
  await paymentBank.selectText()
  await paymentBank.fill('051226054678')

  if (includeTax) {
    await page
      .getByRole('region', {
        name: label(
          socialInsuranceAdministrationMessage.payment.personalAllowance,
        ),
      })
      .getByRole('radio', {
        name: label(socialInsuranceAdministrationMessage.shared.yes),
      })
      .click()

    const personalAllowance = page.getByTestId('personal-allowance-usage')
    await personalAllowance.selectText()
    await personalAllowance.fill('100')

    await page
      .getByRole('region', {
        name: label(socialInsuranceAdministrationMessage.payment.taxLevel),
      })
      .getByRole('radio', {
        name: label(
          socialInsuranceAdministrationMessage.payment.taxIncomeLevel,
        ),
      })
      .click()
  }
  await proceed()
}

export const selectPeriod = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(socialInsuranceAdministrationMessage.period.title),
    }),
  ).toBeVisible()

  await page.getByTestId('select-period.year').click()
  await page.keyboard.press('Enter')

  // TODO: Need to look into this, it may happen that a month is not valid
  await page.getByTestId('select-period.month').click()
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('Enter')
  await proceed()
}

export const additionalAttachments = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(
        socialInsuranceAdministrationMessage.fileUpload.additionalFileTitle,
      ),
    }),
  ).toBeVisible()
  await proceed()
}

export const writeComment = async (page: Page) => {
  const { proceed } = helpers(page)

  await expect(
    page.getByRole('heading', {
      name: label(
        socialInsuranceAdministrationMessage.additionalInfo.commentSection,
      ),
    }),
  ).toBeVisible()
  await page
    .getByPlaceholder(
      label(
        socialInsuranceAdministrationMessage.additionalInfo.commentPlaceholder,
      ),
    )
    .fill(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula malesuada augue, sit amet pulvinar tortor pellentesque at. Nulla facilisi. Nunc vel mi ac mi commodo rhoncus sit amet ut neque.',
    )
  await proceed()
}

export const submitApplication = async (page: Page) => {
  await expect(
    page
      .locator('form')
      .getByText(
        label(socialInsuranceAdministrationMessage.confirm.overviewTitle),
      ),
  ).toBeVisible()
  await page
    .getByRole('button', {
      name: label(socialInsuranceAdministrationMessage.confirm.submitButton),
    })
    .click()
}
