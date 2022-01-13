import {
  findRegulationType,
  findSignatureInText,
  findAffectedRegulationsInText,
} from './guessers'

describe('findRegulationType', () => {
  it('defaults to returning "base" whenever in doubt', () => {
    expect(findRegulationType('')).toEqual('base')
    expect(findRegulationType('Reglugerð um jólasveina')).toEqual('base')
  })

  it('detects "amend"ing regulation titles', () => {
    expect(
      findRegulationType(
        'Reglugerð um breytingu á reglugerð 123/2022 um jólasveina',
      ),
    ).toEqual('amend')
    // Accepts the plural form "breytingar"
    expect(
      findRegulationType(
        'Reglugerð um breytingar á reglugerð 123/2022 um jólasveina',
      ),
    ).toEqual('amend')
    // Accepts the plural form "reglugerðum"
    expect(
      findRegulationType(
        'Reglugerð um breytingu á reglugerðum nr. 23/2022 um jólasveina og Byggingareglugerð nr 112/2012',
      ),
    ).toEqual('amend')
    // Accepts ordinal number in parenthesis
    expect(
      findRegulationType(
        'Reglugerð um (2.) breytingu á reglugerð 123/2022 um jólasveina',
      ),
    ).toEqual('amend')
    expect(
      findRegulationType(
        'Reglugerð um (102.) breytingu á reglugerð 123/2022 um jólasveina',
      ),
    ).toEqual('amend')
    // Also accepts parenthesis around the ordinal number being missing
    expect(
      findRegulationType(
        'Reglugerð um 3. breytingu á reglugerð 123/2022 um jólasveina',
      ),
    ).toEqual('amend')
    // Accepts ordinal number + plural "breytingar"
    expect(
      findRegulationType(
        'Reglugerð um (4.) breytingar á reglugerð 123/2022 um jólasveina',
      ),
    ).toEqual('amend')
    // However, is a stickler about the number being an ordinal
    expect(
      findRegulationType(
        'Reglugerð um 2 breytingar á reglugerð 123/2022 um jólasveina',
      ),
    ).toEqual('base')
    expect(
      findRegulationType(
        'Reglugerð um tvær breytingar á reglugerð 123/2022 um jólasveina',
      ),
    ).toEqual('base')
    // The " á " between the words "breytingu" and "reglugerðar" is mandatory.
    expect(
      findRegulationType(
        'Reglugerð um breytingu reglugerðar 123/2022 um jólasveina',
      ),
    ).toEqual('base')
  })

  it('amending regulation titles must contain the word reglugerð as a subject', () => {
    // Actual example
    expect(
      findRegulationType(
        'Reglugerð um breytingar á Byggingareglugerð nr. 112/2012',
      ),
    ).toEqual('amend')
    // Very sloppy title, but passes
    expect(
      findRegulationType('Reglugerð um breytingu á einhverri annari reglugerð'),
    ).toEqual('amend')
    // Silly title, but (correctly) classified as "base"
    expect(
      findRegulationType('Reglugerð um breytingar á lögum nr. 112/2012'),
    ).toEqual('base')
    // Base regulations may want to do "breytingu á" some non-"reglugerð" subject.
    expect(
      findRegulationType('Reglugerð um breytingu á fjölda jólasveina'),
    ).toEqual('base')

    // If you find yourself in this situation, you probably should rethink your life-coices. :-)
    expect(
      findRegulationType(
        'Reglugerð um breytingu á fjölda jólasveina í takt við ákvæði í ESB reglugerð nr. 1234/2019 um hátíðisdaga',
      ),
    ).toEqual('amend') // 🙀
    // ...or find a way to subtly re-phrase the beginning of the title, like so:
    expect(
      findRegulationType(
        'Reglugerð um fækkun jólasveina í takt við ákvæði í ESB reglugerð nr. 1234/2019 um hátíðisdaga',
      ),
    ).toEqual('base')
  })
})

// ===========================================================================
