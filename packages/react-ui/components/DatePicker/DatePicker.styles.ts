import { css, memoizeStyle } from '../../lib/theming/Emotion';

const styles = {
  root() {
    return css`
      display: inline-block;
      position: relative;
    `;
  },
};

export const jsStyles = memoizeStyle(styles);
