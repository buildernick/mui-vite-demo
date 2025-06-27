import React from 'react';
import type { Preview } from '@storybook/react';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DocsContainer } from '@storybook/blocks';
import { colorSchemes, typography, shadows, shape } from '../src/shared-theme/themePrimitives';
import { inputsCustomizations } from '../src/shared-theme/customizations/inputs';
import { dataDisplayCustomizations } from '../src/shared-theme/customizations/dataDisplay';
import { feedbackCustomizations } from '../src/shared-theme/customizations/feedback';
import { navigationCustomizations } from '../src/shared-theme/customizations/navigation';
import { surfacesCustomizations } from '../src/shared-theme/customizations/surfaces';

// Create light and dark themes using the same configuration as your app
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

// Custom DocsContainer that applies the theme to the docs
const ThemedDocsContainer = ({ context, children }) => {
  // Use the same theme for docs as for the currently selected theme
  const theme = context.globals.theme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DocsContainer context={context}>
        {children}
      </DocsContainer>
    </ThemeProvider>
  );
};

// The ThemeWrapper component adds consistent padding around stories
const ThemeWrapper = ({ children }) => {
  return (
    <div style={{ padding: '1rem' }}>
      {children}
    </div>
  );
};

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true }, // Disable backgrounds addon as we'll use MUI theming
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Configure docs to use our themed container
    docs: {
      container: ThemedDocsContainer,
      toc: true, // Enable table of contents
      story: { inline: true }, // Display stories inline
    },
  },
  
  decorators: [
    // Use Storybook's theme provider to toggle between light and dark themes
    withThemeFromJSXProvider({
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
      defaultTheme: 'light',
      Provider: ThemeProvider,
      GlobalStyles: CssBaseline,
    }),
    // Add consistent padding around all stories
    (Story) => (
      <ThemeWrapper>
        <Story />
      </ThemeWrapper>
    ),
  ],
};

export default preview;

// Import fonts if needed
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/material-icons';
