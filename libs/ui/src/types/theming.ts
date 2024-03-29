import { DefaultTheme } from 'styled-components';
import { ButtonTheme } from '../theme/atoms/button';

type ColorSteps = {
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  step6: string;
  step7: string;
  step8: string;
  step9: string;
  step10: string;
  step11: string;
  step12: string;
};
export interface DAOhausTheme {
  themeName: string;
  font: {
    family: {
      header: string;
      body: string;
      data: string;
    };
    size: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
      xxxxl: string;
    };
    weight: {
      extraLight: number;
      light: number;
      reg: number;
      med: number;
      bold: number;
      black: number;
    };
    lineHeight: string;
    letterSpacing: string;
  };
  rootBgColor: string;
  rootFontColor: string;
  transparent: string;
  primary: ColorSteps;
  primaryA: ColorSteps;
  secondary: ColorSteps;
  secondaryA: ColorSteps;
  neutral: ColorSteps;
  success: ColorSteps;
  warning: ColorSteps;
  danger: ColorSteps;
  info: ColorSteps;
  blue1: string;
  blue2: string;
  blue3: string;
  blue4: string;
  blue5: string;
  blue6: string;
  blue7: string;
  blue8: string;
  blue9: string;
  blue10: string;
  blue11: string;
  blue12: string;
  violet1: string;
  violet2: string;
  violet3: string;
  violet4: string;
  violet5: string;
  violet6: string;
  violet7: string;
  violet8: string;
  violet9: string;
  violet10: string;
  violet11: string;
  violet12: string;
  pink1: string;
  pink2: string;
  pink3: string;
  pink4: string;
  pink5: string;
  pink6: string;
  pink7: string;
  pink8: string;
  pink9: string;
  pink10: string;
  pink11: string;
  pink12: string;
  green1: string;
  green2: string;
  green3: string;
  green4: string;
  green5: string;
  green6: string;
  green7: string;
  green8: string;
  green9: string;
  green10: string;
  green11: string;
  green12: string;
  yellow1: string;
  yellow2: string;
  yellow3: string;
  yellow4: string;
  yellow5: string;
  yellow6: string;
  yellow7: string;
  yellow8: string;
  yellow9: string;
  yellow10: string;
  yellow11: string;
  yellow12: string;
  red1: string;
  red2: string;
  red3: string;
  red4: string;
  red5: string;
  red6: string;
  red7: string;
  red8: string;
  red9: string;
  red10: string;
  red11: string;
  red12: string;
  field: {
    fontWeight: number;
    fontSize: string;
    labelFont: string;
    inputFont: string;
    size: {
      md: string;
      lg: string;
      full: string;
    };
    radius: string;
    transition: string;
  };
  avatar: {
    bg: string;
  };
  button: {
    primary: ButtonTheme;
    secondary: ButtonTheme;
    success: ButtonTheme;
    warning: ButtonTheme;
    danger: ButtonTheme;
    radius: string;
  };
  card: {
    bg: string;
    border: string;
    radius: string;
  };
  checkbox: {
    bg: string;
    border: string;
    radius: string;
    hover: {
      bg: string;
      border: string;
    };
    focus: {
      bg: string;
      border: string;
    };
    disabled: {
      bg: string;
      border: string;
    };
    active: {
      bg: string;
      border: string;
      hover: {
        bg: string;
        border: string;
      };
      focus: {
        bg: string;
        border: string;
      };
      disabled: {
        bg: string;
        border: string;
      };
    };
    indicator: {
      color: string;
      disabled: {
        color: string;
      };
    };
  };
  input: {
    bg: string;
    border: string;
    color: string;
    placeholder: string;
    hover: {
      bg: string;
      border: string;
    };
    focus: {
      bg: string;
      border: string;
    };
    disabled: {
      bg: string;
      border: string;
      color: string;
      placeholder: string;
    };
    success: {
      border: string;
    };
    warning: {
      border: string;
    };
    error: {
      border: string;
    };
    icon: {
      color: string;
    };
  };
  link: {
    color: string;
  };
  loading: {
    primary: {
      color: string;
      bg: string;
    };
    secondary: {
      color: string;
      bg: string;
    };
    success: {
      color: string;
      bg: string;
    };
    warning: {
      color: string;
      bg: string;
    };
    danger: {
      color: string;
      bg: string;
    };
  };
  radio: {
    bg: string;
    border: string;
    hover: {
      bg: string;
      border: string;
    };
    focus: {
      bg: string;
      border: string;
    };
    disabled: {
      bg: string;
      border: string;
    };
    active: {
      bg: string;
      border: string;
      hover: {
        bg: string;
        border: string;
      };
      focus: {
        bg: string;
        border: string;
      };
      disabled: {
        bg: string;
        border: string;
      };
    };
    indicator: {
      bg: string;
      disabled: {
        bg: string;
      };
    };
  };
  select: {
    bg: string;
    border: string;
    radius: string;
    color: string;
    hover: {
      bg: string;
      border: string;
    };
    focus: {
      bg: string;
      border: string;
    };
    disabled: {
      bg: string;
      color: string;
      placeholder: string;
    };
    success: {
      border: string;
    };
    warning: {
      border: string;
    };
    error: {
      border: string;
    };
    option: {
      bg: string;
      color: string;
    };
    icon: {
      color: string;
    };
  };
  switch: {
    base: {
      bg: string;
      disabled: {
        bg: string;
      };
      active: {
        bg: string;
        disabled: {
          bg: string;
        };
      };
    };
    indicator: {
      bg: string;
      border: string;
      hover: {
        bg: string;
        border: string;
      };
      focus: {
        bg: string;
        border: string;
      };
      disabled: {
        bg: string;
        border: string;
      };
      active: {
        bg: string;
        border: string;
        hover: {
          bg: string;
          border: string;
        };
        focus: {
          bg: string;
          border: string;
        };
        disabled: {
          bg: string;
          border: string;
        };
      };
    };
    label: {
      color: string;
      disabled: {
        color: string;
      };
    };
  };
  tag: {
    radius: string;
  };
  textarea: {
    bg: string;
    border: string;
    color: string;
    placeholder: string;
    hover: {
      bg: string;
      border: string;
    };
    focus: {
      bg: string;
      border: string;
    };
    disabled: {
      bg: string;
      border: string;
      placeholder: string;
    };
    success: {
      border: string;
    };
    warning: {
      border: string;
    };
    error: {
      border: string;
    };
  };
  tooltip: {
    radius: string;
    icon: {
      color: string;
    };
    content: {
      bg: string;
      color: string;
    };
  };
  // *** MOLECULES *** //
  addressDisplay: {
    color: string;
    icon: {
      color: string;
    };
  };
  banner: {
    bg: string;
    border: string;
    color: string;
  };
  collapsibleCard: {
    outer: {
      bg: string;
      border: string;
    };
    inner: {
      bg: string;
      border: string;
    };
    trigger: {
      color: string;
      hover: {
        color: string;
      };
      focus: {
        color: string;
      };
    };
  };
  dialog: {
    radius: string;
    overlay: {
      bg: string;
    };
    content: {
      bg: string;
      color: string;
    };
  };
  dropdown: {
    content: {
      primary: {
        bg: string;
      };
      secondary: {
        bg: string;
      };
    };
    item: {
      primary: {
        bg: string;
      };
      secondary: {
        bg: string;
      };
      focus: {
        primary: {
          bg: string;
        };
        secondary: {
          bg: string;
        };
      };
      highlight: {
        primary: {
          bg: string;
        };
        secondary: {
          bg: string;
        };
      };
      disabled: {
        color: string;
      };
    };
    separator: {
      bg: string;
    };
    link: {
      color: string;
      hover: {
        bg: string;
        border: string;
      };
      disabled: {
        color: string;
      };
    };
  };
  fieldAlert: {
    bg: string;
    border: string;
    radius: string;
    warning: {
      bg: string;
      border: string;
      button: {
        bg: string;
        border: string;
        hover: {
          bg: string;
          border: string;
        };
        active: {
          bg: string;
          border: string;
        };
      };
    };
  };
  imageInput: {
    imageWrapper: {
      bg: string;
    };
    cancelIcon: {
      color: string;
    };
  };
  inputSelect: {
    bg: string;
    color: string;
    hover: {
      bg: string;
    };
    focus: {
      bg: string;
    };
    disabled: {
      bg: string;
    };
    selectBox: {
      bg: string;
    };
  };
  navigationMenu: {
    root: {
      bg: string;
    };
    content: {
      bg: string;
      border: string;
    };
    baseItem: {
      color: string;
      hover: {
        bg: string;
      };
      focus: {
        bg: string;
      };
    };
    link: {
      active: {
        border: string;
        color: string;
      };
    };
  };
  tabs: {
    links: {
      color: string;
    };
    link: {
      color: string;
      hover: {
        color: string;
      };
      active: {
        border: string;
      };
    };
  };
  toast: {
    bg: string;
    border: string;
    radius: string;
    success: {
      bg: string;
      border: string;
    };
    warning: {
      bg: string;
      border: string;
    };
    error: {
      bg: string;
      border: string;
    };
    icon: {
      default: string;
      success: string;
      warning: string;
      error: string;
    };
  };
}

export interface Theme extends DefaultTheme, DAOhausTheme {}

export interface ThemeOverrides extends Partial<DefaultTheme> {
  themeName: string;
}
