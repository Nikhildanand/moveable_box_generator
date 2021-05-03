import { JUMP_VALUE } from './box.data';

export const newPosition = (
  isAdd: boolean,
  oldposition: number,
  multiplier: number
): number => {
  const jumpFactor = JUMP_VALUE * multiplier;

  return isAdd ? oldposition + jumpFactor : oldposition - jumpFactor;
};
