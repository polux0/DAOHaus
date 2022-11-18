import { StyledLoader, StyledInvisibleSpan } from './Loading.styles';
import { useTheme } from 'styled-components';

import { Theme } from '../../../types/theming';
import { LoadingProps } from './Loading.types';

export const Loading = ({
  color = 'primary',
  size = 50,
  ...rest
}: LoadingProps) => {
  const theme = useTheme() as Theme;
  return (
    <>
      <StyledLoader
        viewBox="0 0 100 101"
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        width={size}
        {...rest}
      >
        <path
          d="M100 50.59c0 27.615-22.386 50.001-50 50.001s-50-22.386-50-50 22.386-50 50-50 50 22.386 50 50zm-90.919 0c0 22.6 18.32 40.92 40.919 40.92 22.599 0 40.919-18.32 40.919-40.92 0-22.598-18.32-40.918-40.919-40.918-22.599 0-40.919 18.32-40.919 40.919z"
          fill={theme[color].step11}
        />
        <path
          d="M93.968 39.04c2.425-.636 3.894-3.128 3.04-5.486A50 50 0 0041.735 1.279c-2.474.414-3.922 2.919-3.285 5.344.637 2.426 3.12 3.849 5.6 3.484a40.916 40.916 0 0144.131 25.769c.902 2.34 3.361 3.802 5.787 3.165z"
          fill={theme[color].step8}
        />
      </StyledLoader>
      <StyledInvisibleSpan>Loading...</StyledInvisibleSpan>
    </>
  );
};
