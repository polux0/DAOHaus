import { FieldLegoBase, FormLegoBase } from '@daohaus/utils';
import { JSXElementConstructor } from 'react';
import { RegisterOptions } from 'react-hook-form';

type FieldBase = Record<
  string,
  JSXElementConstructor<{
    id: string;
    disabled?: boolean;
    rules?: RegisterOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [property: string]: any;
  }>
>;

export type FieldLego = FieldLegoBase<FieldBase>;
export type FormLego = FormLegoBase<FieldBase>;
