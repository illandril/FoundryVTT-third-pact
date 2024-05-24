type Callback = (levels: number, progression: keyof dnd5e.config.spellProgression) => boolean;

const someSpellcastingClass = (actor: dnd5e.documents.Actor5e, fn: Callback) =>
  actor.items.some((item) => {
    if (item.type === 'class') {
      const progression = item.spellcasting?.progression;
      if (progression) {
        const systemData = item.system as dnd5e.documents.ItemSystemData.Class;
        const levels = systemData.levels || 0;
        return fn(levels, progression);
      }
    }
    return false;
  });

export default someSpellcastingClass;
