import { Injectable } from '@nestjs/common'
import { YesOrNoEnum } from '@island.is/application/core'
import { ApplicationTypes } from '@island.is/application/types'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  DepositAmount,
  HomeApi,
  InspectorType,
  Payer,
  PaymentDay,
  PaymentMethod,
  PropertyPart,
  PropertyType,
  RentIndex,
  SecurityDepositType,
  SpecialGroup,
} from '@island.is/clients/hms-rental-agreement'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { RentalHousingCategoryClass } from '../../../../../../../application/templates/rental-agreement/src/utils/enums'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { generateRentalAgreementEmail } from './rental-agreement-email'
import { applicationAnswers, formatPhoneNumber } from './utils'

@Injectable()
export class RentalAgreementService extends BaseTemplateApiService {
  constructor(
    private readonly homeApi: HomeApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.RENTAL_AGREEMENT)
  }

  private homeApiWithAuth(auth: Auth) {
    return this.homeApi.withMiddleware(new AuthMiddleware(auth))
  }

  async sendApplicationSummary({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateRentalAgreementEmail,
      application,
    )
    return
  }

  async submitApplicationToHmsRentalService({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { id, applicant, answers } = application

    const {
      landlords,
      tenants,
      searchResults,
      units,
      categoryType,
      categoryClass,
      categoryClassGroup,
      description,
      rules,
      conditionDescription,
      inspector,
      inspectorName,
      files,
      fireBlanket,
      smokeDetectors,
      fireExtinguisher,
      emergencyExits,
      startDate,
      endDate,
      rentalAmount,
      isIndexConnected,
      indexType,
      paymentMethod,
      paymentMethodOther,
      paymentDay,
      paymentDayOther,
      bankAccountNumber,
      nationalIdOfAccountOwner,
      securityDepositType,
      securityDepositAmount,
      securityDepositAmountOther,
      otherInfo,
      bankGuaranteeInfo,
      thirdPartyGuaranteeInfo,
      insuranceCompanyInfo,
      landlordsMutualFundInfo,
      housingFundPayee,
      housingFundAmount,
      electricityCostPayee,
      electricityCostMeterNumber,
      electricityCostMeterStatus,
      electricityCostMeterStatusDate,
      heatingCostPayee,
      heatingCostMeterNumber,
      heatingCostMeterStatus,
      heatingCostMeterStatusDate,
      otherCostItems,
    } = applicationAnswers(answers)

    // TODO: Use when we can send real data to Taktikal
    // const landlordsArray = landlords?.map((landlord) => {
    //   return {
    //     nationalId: landlord.nationalIdWithName.nationalId,
    //     name: landlord.nationalIdWithName.name,
    //     email: landlord.email,
    //     phone: formatPhoneNumber(landlord.phone),
    //     address: landlord.address,
    //     isRepresentative: Boolean(
    //       landlord.isRepresentative.includes('isRepresentative'),
    //     ),
    //   }
    // })
    // const tenantsArray = tenants?.map((tenant) => {
    //   return {
    //     nationalId: tenant.nationalIdWithName.nationalId,
    //     name: tenant.nationalIdWithName.name,
    //     email: tenant.email,
    //     phone: formatPhoneNumber(tenant.phone),
    //     address: tenant.address,
    //     isRepresentative: Boolean(
    //       tenant.isRepresentative.includes('isRepresentative'),
    //     ),
    //   }
    // })

    // TODO: Remove when we can send real data to Taktikal
    const landlordsArray = [
      {
        nationalId: '5000101886',
        name: 'Undirritari Björn Egilsson',
        email: 'heba@kolibri.is',
        phone: '1111111',
        address: 'Valshlíð 6',
        isRepresentative: false,
      },
      {
        nationalId: '6000101991',
        name: 'Sigrún prófari Helgadóttir',
        email: 'dadi@kolibri.is',
        phone: '3333333',
        address: 'Krummahólar 2',
        isRepresentative: true,
      },
    ]
    const tenantsArray = [
      {
        nationalId: '6000101990',
        name: 'Undirritari Jónsson',
        email: 'addi@kolibri.is',
        phone: '2222222',
        address: 'Reyrengi 55',
        isRepresentative: false,
      },
      {
        nationalId: '6000101992',
        name: 'Dagný prófari Bjarkadóttir',
        email: 'arni@arnij.com',
        phone: '4444444',
        address: 'Engimýri 3',
        isRepresentative: true,
      },
    ]

    const propertyId =
      units && units.length > 0 ? units[0].propertyCode ?? null : null

    const appraisalUnits = units?.map((unit) => {
      const propertySize =
        unit.changedSize && unit.changedSize >= 3 ? unit.changedSize : unit.size
      const apartmentFloor =
        unit.unitCode && parseInt(unit.unitCode.substring(2, 4), 10).toString()
      const apartmentNumber =
        unit.unitCode && parseInt(unit.unitCode.slice(-2), 10).toString()

      return {
        appraisalUnitId: unit.unitCode ?? null,
        apartmentNumber: apartmentNumber ?? null,
        floor: apartmentFloor ?? null,
        size:
          propertySize !== undefined && propertySize !== null
            ? propertySize
            : 0,
        rooms:
          unit.numOfRooms !== undefined && unit.numOfRooms !== null
            ? unit.numOfRooms
            : 0,
      }
    })

    const parseToNumber = (value: string): number => {
      const parsed = parseInt(value, 10)
      return isNaN(parsed) ? 0 : parsed
    }

    const getSecurityDepositTypeDescription = (type: string) => {
      if (
        type === SecurityDepositType.Capital ||
        type === SecurityDepositType.Other ||
        type === ''
      ) {
        return null
      }

      switch (type) {
        case SecurityDepositType.BankGuarantee:
          return bankGuaranteeInfo
        case SecurityDepositType.ThirdPartyGuarantee:
          return thirdPartyGuaranteeInfo
        case SecurityDepositType.InsuranceCompany:
          return insuranceCompanyInfo
        case SecurityDepositType.LandlordMutualFund:
          return landlordsMutualFundInfo
        default:
          return null
      }
    }

    const newApplication = {
      applicationId: id,
      initiatorNationalId: applicant,
      landlords: landlordsArray ?? [],
      tenants: tenantsArray ?? [],
      property: {
        address: searchResults?.address ?? null,
        municipality: searchResults?.municipalityName ?? null,
        zip: searchResults?.postalCode?.toString() ?? null,
        propertyId: propertyId?.toString() ?? null,
        appraisalUnits: appraisalUnits ?? null,
        part: 'Whole' as PropertyPart, // Whole | Part // TODO: How should this be handled? We are not asking about this in the application
        type: categoryType as PropertyType,
        specialGroup:
          categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS
            ? (categoryClassGroup as SpecialGroup)
            : SpecialGroup.No,
      },
      lease: {
        description: description,
        rules: rules,
        condition: conditionDescription || 'See files for info', // TODO: Check if this is ok?
        inspectorType: inspector as InspectorType,
        hasInspectionFiles: files && files.length > 0 ? true : false,
        indipendantInspector: inspectorName,
        fireProtections: {
          fireBlanket: parseToNumber(fireBlanket || '0'),
          emergencyExits: parseToNumber(emergencyExits || '0'),
          smokeDetectors: parseToNumber(smokeDetectors || '0'),
          fireExtinguisher: parseToNumber(fireExtinguisher || '0'),
        },
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        isFixedTerm: endDate ? true : false,
        rent: {
          amount: parseToNumber(rentalAmount || '0'),
          index:
            isIndexConnected === YesOrNoEnum.YES && indexType
              ? (indexType as RentIndex)
              : RentIndex.None,
          indexRate: null, // TODO: add the index rate when it has been implemented in the application
        },
        payment: {
          method: paymentMethod as PaymentMethod,
          otherMethod:
            paymentMethod === PaymentMethod.Other ? paymentMethodOther : null,
          paymentDay: paymentDay as PaymentDay,
          otherPaymentDay:
            paymentDay === PaymentDay.Other ? paymentDayOther : null,
          bankAccountNumber:
            paymentMethod === PaymentMethod.BankTransfer
              ? bankAccountNumber
              : null,
          nationalIdOfAccountOwner:
            paymentMethod === PaymentMethod.BankTransfer
              ? nationalIdOfAccountOwner
              : null,
        },
        securityDeposit: {
          type: securityDepositType
            ? (securityDepositType as SecurityDepositType)
            : undefined,
          otherType:
            securityDepositType === SecurityDepositType.Other
              ? otherInfo
              : null,
          description: securityDepositType
            ? getSecurityDepositTypeDescription(securityDepositType)
            : null,
          amount: securityDepositAmount as DepositAmount,
          otherAmount:
            securityDepositAmount === DepositAmount.Other
              ? parseToNumber(securityDepositAmountOther || '0')
              : 0,
        },
        otherFees: {
          housingFund: {
            payedBy:
              housingFundPayee === Payer.Tenant ? Payer.Tenant : Payer.Landlord,
            amount:
              housingFundAmount !== undefined && housingFundAmount !== null
                ? Number(housingFundAmount)
                : 0,
          },
          electricityCost: {
            payedBy:
              electricityCostPayee === Payer.Tenant
                ? Payer.Tenant
                : Payer.Landlord,
            meterNumber: electricityCostMeterNumber || null,
            meterStatus: electricityCostMeterStatus || null,
            meterStatusDate: electricityCostMeterStatusDate
              ? new Date(electricityCostMeterStatusDate)
              : null,
          },
          heatingCost: {
            payedBy:
              heatingCostPayee === Payer.Tenant ? Payer.Tenant : Payer.Landlord,
            meterNumber: heatingCostMeterNumber || null,
            meterStatus: heatingCostMeterStatus || null,
            meterStatusDate: heatingCostMeterStatusDate
              ? new Date(heatingCostMeterStatusDate)
              : null,
          },
          miscellaneousFees: otherCostItems
            ? Object.values(otherCostItems)
                .filter(
                  (item) => item.description && item.description.trim() !== '',
                )
                .map((item) => ({
                  name: item.description,
                  amount: Number(item.amount) || 0,
                }))
            : [],
        },
      },
    }

    return await this.homeApiWithAuth(auth)
      .contractPost({
        leaseApplication: newApplication,
      })
      .catch((error) => {
        console.log('Error sending application to HMS Rental Service: ', error)

        throw new Error('Error sending application to HMS Rental Service')
      })
  }
}
