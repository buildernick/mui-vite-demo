import type { Preview } from '@storybook/react-vite'
import { ThemeProvider, createTheme } from '@mui/material';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { CssBaseline } from '@mui/material';

// Import your theme primitives and customizations
import { colorSchemes, typography, shadows, shape } from '../src/shared-theme/themePrimitives';
import { inputsCustomizations } from '../src/shared-theme/customizations/inputs';
import { dataDisplayCustomizations } from '../src/shared-theme/customizations/dataDisplay';
import { feedbackCustomizations } from '../src/shared-theme/customizations/feedback';
import { navigationCustomizations } from '../src/shared-theme/customizations/navigation';
import { surfacesCustomizations } from '../src/shared-theme/customizations/surfaces';

// Import fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/material-icons';

// Create light and dark themes
const lightTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-mui-color-scheme",
    cssVarPrefix: "template",
  },
  defaultColorScheme: "light",
  colorSchemes,
  typography,
  shadows,
  shape,
  components: {
    ...inputsCustomizations,
    ...dataDisplayCustomizations,
    ...feedbackCustomizations,
    ...navigationCustomizations,
    ...surfacesCustomizations,
  },
});

const darkTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-mui-color-scheme",
    cssVarPrefix: "template",
  },
  defaultColorScheme: "dark",
  colorSchemes,
  typography,
  shadows,
  shape,
  components: {
    ...inputsCustomizations,
    ...dataDisplayCustomizations,
    ...feedbackCustomizations,
    ...navigationCustomizations,
    ...surfacesCustomizations,
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
  decorators: [withThemeFromJSXProvider({
    GlobalStyles: CssBaseline,
    Provider: ThemeProvider,
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
    defaultTheme: 'light',
  })]
};

export default preview;