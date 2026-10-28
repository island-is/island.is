import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ChildOutput,
  CreateEmergencyContactInput,
  EmergencyContactOutput,
  FriggApi,
  HealthProfileOutput,
  LanguageProfileOutput,
  MnarSurApi,
  Option,
  UpdateEmergencyContactInput,
  UpdateHealthProfileInput,
  UpdateLanguageProfileInput,
} from '../../gen/fetch'

/**
 * Client for the MMS "Mínar síður" (Lykilupplýsingar) endpoints of the Frigg
 * form-api: a child's emergency contacts, language profile and health profile,
 * plus the key-option lookup lists those sections pick from. The per-child
 * endpoints live on the generated `MnarSurApi`; the lookups are ordinary Frigg
 * `/key-options` reads (`FriggApi.getAllKeyOptions`).
 *
 * Every method returns the generated DTO as-is — the education GraphQL mapper
 * owns any UI shaping (e.g. `value[{content,language}]` → a localised title).
 */

/** A key-option tagged with the key-option `type` it was served under. Allergies
 * come from two types (`allergy` and `foodAllergyAndIntolerance`); the tag is
 * what lets the UI group them. */
export type AllergyOption = Option & { type: string }

const RELATION_TYPE = 'relation'
const LANGUAGE_ENVIRONMENT_TYPE = 'languageEnvironment'

/** The two key-option types MMS serves allergy lookups under. Exported because
 * the education mapper has to derive an allergy's category from them. */
export const FOOD_ALLERGY_TYPE = 'foodAllergyAndIntolerance'
export const OTHER_ALLERGY_TYPE = 'allergy'

const ALLERGY_TYPES = [OTHER_ALLERGY_TYPE, FOOD_ALLERGY_TYPE]

@Injectable()
export class FriggKeyInfoClientService {
  constructor(
    private readonly mnarSurApi: MnarSurApi,
    private readonly friggApi: FriggApi,
  ) {}

  private mnarSurWithAuth = (user: User) =>
    this.mnarSurApi.withMiddleware(new AuthMiddleware(user as Auth))

  private friggWithAuth = (user: User) =>
    this.friggApi.withMiddleware(new AuthMiddleware(user as Auth))

  private async keyOptions(user: User, type: string): Promise<Option[]> {
    const groups = await this.friggWithAuth(user).getAllKeyOptions({ type })
    return groups.flatMap((group) => group.options)
  }

  /* -- Children ------------------------------------------------------------ */

  getChildren(user: User): Promise<ChildOutput[]> {
    return this.mnarSurWithAuth(user).listChildren()
  }

  /* -- Lookup lists (key-options) ------------------------------------------ */

  getRelationTypeOptions(user: User): Promise<Option[]> {
    return this.keyOptions(user, RELATION_TYPE)
  }

  getLanguageEnvironmentOptions(user: User): Promise<Option[]> {
    return this.keyOptions(user, LANGUAGE_ENVIRONMENT_TYPE)
  }

  async getAllergyOptions(user: User): Promise<AllergyOption[]> {
    const lists = await Promise.all(
      ALLERGY_TYPES.map(async (type) =>
        (await this.keyOptions(user, type)).map((option) => ({
          ...option,
          type,
        })),
      ),
    )
    return lists.flat()
  }

  /* -- Emergency contacts -------------------------------------------------- */

  getEmergencyContacts(
    user: User,
    childId: string,
  ): Promise<EmergencyContactOutput[]> {
    return this.mnarSurWithAuth(user).listEmergencyContacts({ childId })
  }

  addEmergencyContact(
    user: User,
    childId: string,
    input: CreateEmergencyContactInput,
  ): Promise<EmergencyContactOutput> {
    return this.mnarSurWithAuth(user).createEmergencyContact({
      childId,
      createEmergencyContactInput: input,
    })
  }

  updateEmergencyContact(
    user: User,
    childId: string,
    agentId: string,
    input: UpdateEmergencyContactInput,
  ): Promise<EmergencyContactOutput> {
    return this.mnarSurWithAuth(user).updateEmergencyContact({
      childId,
      agentId,
      updateEmergencyContactInput: input,
    })
  }

  async deleteEmergencyContact(
    user: User,
    childId: string,
    agentId: string,
  ): Promise<void> {
    await this.mnarSurWithAuth(user).deleteEmergencyContact({ childId, agentId })
  }

  /* -- Health profile ------------------------------------------------------ */

  getHealthProfile(user: User, childId: string): Promise<HealthProfileOutput> {
    return this.mnarSurWithAuth(user).getHealthProfile({ childId })
  }

  updateHealthProfile(
    user: User,
    childId: string,
    input: UpdateHealthProfileInput,
  ): Promise<HealthProfileOutput> {
    return this.mnarSurWithAuth(user).replaceHealthProfile({
      childId,
      updateHealthProfileInput: input,
    })
  }

  /* -- Language profile ---------------------------------------------------- */

  getLanguageProfile(
    user: User,
    childId: string,
  ): Promise<LanguageProfileOutput> {
    return this.mnarSurWithAuth(user).getLanguageProfile({ childId })
  }

  updateLanguageProfile(
    user: User,
    childId: string,
    input: UpdateLanguageProfileInput,
  ): Promise<LanguageProfileOutput> {
    return this.mnarSurWithAuth(user).replaceLanguageProfile({
      childId,
      updateLanguageProfileInput: input,
    })
  }
}
