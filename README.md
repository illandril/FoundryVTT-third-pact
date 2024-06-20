# Illandril's Character Class Enhancements (5e)
*(formerly "Illandril's Pact Slot Third Caster (5e)")*

| [![Illandril](https://avatars.githubusercontent.com/illandril?size=64)](https://github.com/illandril) | [![Author](https://img.shields.io/badge/Joe%20Spandrusyszyn-Illandril?style=flat&labelColor=520&color=250&label=Illandril)](https://github.com/illandril) [![License](https://img.shields.io/github/license/illandril/FoundryVTT-third-pact?style=flat&labelColor=520&color=250&label=license)](https://github.com/illandril/FoundryVTT-third-pact/blob/main/LICENSE) <br> [![Version](https://img.shields.io/github/v/release/illandril/FoundryVTT-third-pact?style=flat&labelColor=520&color=250&label=version)](https://github.com/illandril/FoundryVTT-third-pact/releases) [![Open Issues](https://img.shields.io/github/issues/illandril/FoundryVTT-third-pact?style=flat&labelColor=520&color=250&logo=github&label=issues)](https://github.com/illandril/FoundryVTT-third-pact/issues) [![Latest Release Download Count](https://img.shields.io/github/downloads/illandril/FoundryVTT-third-pact/latest/module.zip?style=flat&labelColor=520&color=250&label=downloads)](#) <br> [![Foundry Minimum Version](https://img.shields.io/badge/dynamic/json?style=flat&labelColor=520&color=250&label=Min.%20Foundry%20&prefix=v&query=$.compatibility.minimum&url=https%3A%2F%2Fgithub.com%2Fillandril%2FFoundryVTT-third-pact%2Freleases%2Flatest%2Fdownload%2Fmodule.json)](https://foundryvtt.com/packages/illandril-third-pact) [![Foundry Verified Version](https://img.shields.io/badge/dynamic/json?style=flat&labelColor=520&color=250&label=Verified%20on&prefix=v&query=$.compatibility.verified&url=https%3A%2F%2Fgithub.com%2Fillandril%2FFoundryVTT-third-pact%2Freleases%2Flatest%2Fdownload%2Fmodule.json)](https://foundryvtt.com/packages/illandril-third-pact) [![Forge Installs](https://img.shields.io/badge/dynamic/json?style=flat&labelColor=520&color=250&label=Forge%20Installs&query=package.installs&url=http%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fillandril-third-pact&suffix=%25)](https://forge-vtt.com/bazaar/package/illandril-third-pact) |
| --- | :--- |

Adds support for alternative Spell Progression types (including Third Caster Pact Magic, Three Quarters Caster, and more), and allows a d20 option for hit dice.

The specific rounding mode for Pact and Leveled progressions can also be configured if the default rounding (round down when multiclassing with multiple spellcasting classes, round up otherwise).

Rounding Modes:
1. Standard Rounding (round down when multiclassing with other Pact Magic classes, round up otherwise; similar to non-Pact Third Casters)
1. Always Round Up
1. Always Round Down (ex. [Blood Hunter Order of the Profane Soul](https://www.dndbeyond.com/classes/blood-hunter#OrderoftheProfaneSoul))
1. Round Down, Minimum 1
