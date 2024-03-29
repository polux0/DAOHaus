import { ComponentMeta, ComponentStory } from '@storybook/react';
import { RiAlertLine, RiArrowDropDownLine } from 'react-icons/ri/index.js';
import { Button } from './Button';

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    color: {
      description: 'Set the base theme color for the button',
      defaultValue: 'primary',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      control: { type: 'radio' },
    },
    variant: {
      description: 'Set the variant of the button',
      defaultValue: 'solid',
      options: ['solid', 'outline', 'ghost', 'link'],
      control: { type: 'radio' },
    },
    size: {
      description: 'Set the size of the button',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    justify: {
      description:
        'Allow for positioning content inside the button based on justify content and flexbox container',
      defaultValue: 'center',
      options: [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
      ],
      control: { type: 'radio' },
    },
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof Button>;

// Setting displayName manually since Storybook displays it as [Object, object]
Button.displayName = 'Button';

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const BaseButton = Template.bind({});

BaseButton.args = {
  children: 'Button',
  color: 'primary',
  variant: 'solid',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  children: 'Button',
  color: 'primary',
  variant: 'solid',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
};

export const PrimaryButtonOutline = Template.bind({});
PrimaryButtonOutline.args = {
  children: 'Button',
  color: 'primary',
  variant: 'outline',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
};

export const PrimaryButtonAsLink = Template.bind({});
PrimaryButtonAsLink.args = {
  children: 'Button',
  color: 'primary',
  variant: 'link',
  href: 'https://daohaus.club',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
};

export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
  children: 'Button',
  color: 'secondary',
  variant: 'solid',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
};

export const SecondaryButtonOutline = Template.bind({});
SecondaryButtonOutline.args = {
  children: 'Button',
  color: 'secondary',
  variant: 'outline',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
};

export const SecondaryButtonAsLink = Template.bind({});
SecondaryButtonAsLink.args = {
  children: 'Button',
  color: 'secondary',
  variant: 'link',
  href: 'https://daohaus.club',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
};

export const ButtonLeftIcon = Template.bind({});
ButtonLeftIcon.args = {
  children: 'Button',
  color: 'primary',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
  IconLeft: RiAlertLine,
};

export const ButtonRightIcon = Template.bind({});
ButtonRightIcon.args = {
  children: 'Button',
  color: 'primary',
  variant: 'link',
  href: 'https://daohaus.club',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
  IconRight: RiArrowDropDownLine,
};

export const ButtonWithLeftAndRightIcons = Template.bind({});
ButtonWithLeftAndRightIcons.args = {
  children: 'Button',
  color: 'primary',
  variant: 'link',
  href: 'https://daohaus.club',
  size: 'md',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  justify: 'center',
  IconLeft: RiAlertLine,
  IconRight: RiArrowDropDownLine,
};
