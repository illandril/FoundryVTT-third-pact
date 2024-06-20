const roundLevels = (isMultiClass: boolean, levels: number, roundingMode: RoundingMode) => {
  if (roundingMode === 'downMin1' && levels < 1) {
    return 1;
  }
  let roundDown: boolean;
  switch (roundingMode) {
    case 'down':
    case 'downMin1':
      roundDown = true;
      break;
    case 'up':
      roundDown = false;
      break;
    default:
      roundDown = isMultiClass;
  }

  if (roundDown) {
    return Math.floor(levels);
  }
  return Math.ceil(levels);
};

export default roundLevels;
