
type Callback = (
  item: dnd5e.documents.ItemSystemData.Class,
  progression: keyof dnd5e.config.spellProgression,
) => boolean;

const someSpellcastingClass = (actor: dnd5e.documents.Actor5e, fn: Callback) => actor
  .items.some((item) => {
    if (item.type === 'class') {
      const itemData = item.system as dnd5e.documents.ItemSystemData.Class;
      const progression = itemData.spellcasting?.progression;
      if (progression) {
        return fn(itemData, progression);
      }
    }
    return false;
  });

export default someSpellcastingClass;
