import styled, { css } from 'styled-components';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

import { Link, LinkStyles } from '../../atoms';
import { DropdownColor } from './Dropdown.types';

// * Start New Dropdown implementation
export const Root = Dropdown.Root;
export const Portal = Dropdown.Portal;
export const Group = Dropdown.Group;
export const RadioGroup = Dropdown.RadioGroup;

export const Trigger = styled(Dropdown.Trigger)`
  svg.icon-right {
    transition: 0.2s all;
    margin-left: auto;
  }

  &[data-state='open'] svg.icon-right {
    transform: rotate(180deg);
  }
`;

const BaseContentStyle = css<{ $color?: DropdownColor }>`
  background-color: ${({ $color = 'primary', theme }) =>
    theme.dropdown.content[$color].bg};
  border-radius: 4px;
  font-weight: ${({ theme }) => theme.font.weight.reg};
  line-height: ${({ theme }) => theme.font.lineHeight};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing};
  font-size: ${({ theme }) => theme.font.size.md};
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Content = styled(Dropdown.DropdownMenuContent)<{
  $color?: DropdownColor;
}>`
  ${BaseContentStyle}
`;

export const SubContent = styled(Dropdown.DropdownMenuSubContent)<{
  $color?: DropdownColor;
}>`
  ${BaseContentStyle}
`;

export const Label = styled(Dropdown.Label)`
  font-size: ${({ theme }) => theme.font.size.xs};
  min-height: 4.8rem;
  padding: 12px;
`;

const BaseItemStyles = css<{ $color?: DropdownColor }>`
  align-items: center;
  background-color: ${({ $color = 'primary', theme }) =>
    theme.dropdown.item[$color].bg};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  font-weight: 400;
  height: 48px;
  outline: none;
  padding: 0 12px;
  width: 100%;

  &:focus-visible {
    background-color: ${({ $color = 'primary', theme }) =>
      theme.dropdown.item.focus[$color].bg};
  }

  &[data-highlighted] {
    background-color: ${({ $color = 'primary', theme }) =>
      theme.dropdown.item.highlight[$color].bg};
  }

  &[data-disabled] {
    cursor: not-allowed;
    color: ${({ theme }) => theme.dropdown.item.disabled.color};

    & * {
      color: ${({ theme }) => theme.dropdown.item.disabled.color};
    }
  }
`;

export const Item = styled(Dropdown.Item)<{ $color?: DropdownColor }>`
  ${BaseItemStyles}

  svg {
    width: 2.2rem;
    height: 2.2rem;

    &.icon-left {
      margin-right: 1rem;
    }

    &.icon-right {
      margin-left: 0.5rem;
    }
  }
`;

export const CheckboxItem = styled(Dropdown.CheckboxItem)<{
  $color?: DropdownColor;
}>`
  ${BaseItemStyles}
`;

export const RadioItem = styled(Dropdown.RadioItem)<{ $color?: DropdownColor }>`
  ${BaseItemStyles}
`;

export const SubTrigger = styled(Dropdown.SubTrigger)<{
  $color?: DropdownColor;
}>`
  ${BaseItemStyles}
`;

export const Separator = styled(Dropdown.Separator)`
  /* ! Does this need to be dynamic?  */
  background-color: ${({ theme }) => theme.dropdown.separator.bg};
  height: 1px;
  margin: 5px 0;
  width: 100%;
`;

export const ItemIndicator = styled(Dropdown.ItemIndicator)`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const DropdownLinkStyles = css`
  ${LinkStyles}
  color: ${({ theme }) => theme.dropdown.link.color};

  &:hover {
    background-color: ${({ theme }) => theme.dropdown.link.hover.bg};
    border-color: ${({ theme }) => theme.dropdown.link.hover.border};
    text-decoration: none;
  }

  &.disabled {
    color: ${({ theme }) => theme.dropdown.link.disabled.color};
  }
`;

export const StyledDropdownLink = styled(Link)`
  ${DropdownLinkStyles}
`;
