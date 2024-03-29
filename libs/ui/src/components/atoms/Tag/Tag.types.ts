import { ReactNode } from 'react';

import { IconType } from 'react-icons/lib/esm';

export type TagColors = 'blue' | 'green' | 'pink' | 'violet' | 'yellow' | 'red';

export type TagProps = {
  children: ReactNode;
  tagColor: TagColors;
  className?: string;
  IconLeft?: IconType;
  IconRight?: IconType;
  fontSize?: string;
};
