# Pósthólfið

## Getting started

* Sækja um aðgang að pósthólfinu. Sótt er um aðgang að pósthólfinu á umsóknavef island.is https://island.is/postholf/stofnanir. <br/>Í umsókninni þarf að skrá upplýsingar um stofnunina sem sækir um ásamt ábyrgðaraðila og tæknilegan tengilið.


* Sé umsókn samþykkt fær tæknilegur tengiliður eftirfarandi aðgangsupplýsingar:
    * ClientId / ClientSecret - Til þess að kalla á Skjalatilkynning
    * Audience 
    * Scope
* Umsækjandi þarf að útfæra keyrslu sem sendir inn skjalatilvísanir í pósthólf með því að kalla á  [Skjalatilkynning API](./postholf-03-interface-skjalatilkynning.md). Sýnidæmi má sjá undir DocumentindexCLI: https://github.com/digitaliceland/postholf-demo
* Umsækjandi þarf að útfæra callback þjónustu sem skilar skjali þegar notandi sækir það.  Þjónustan þarf að vera útfærð samkvæmt fyrirframskilgreindum skilum (sjá [Skjalaveita API](./postholf-03-interface-skjalaveita.md)).  
Sýnidæmi: https://github.com/digitaliceland/postholf-demo
* Senda þarf Stafrænu íslandi upplýsingar um hvar (url) hægt er að kalla í skjalaveitu þjónustuna sem var útfærð í liðnum að ofan.

## Content

- [Introduction](postholf-01-intro-and-overview.md)
- [Skjalatilkynning API](postholf-02-interface-skjalatilkynning.md)
- [Skjalaveita API](postholf-03-interface-skjalaveita.md)
- [Sequence Diagram](postholf-04-sequence-diagram.md)
- [Interfaces](postholf-05-interfaces.md)

