import React from 'react';
import type { Preview } from '@storybook/react';
import { CssBaseline } from '@mui/material';
import AppTheme from '../src/shared-theme/AppTheme';

// Define props interface for the wrapper component
interface ThemeWrapperProps {
  children: React.ReactNode;
}

// Create a wrapper component with proper TypeScript typing
const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  return (
    <div className="theme-wrapper" style={{ padding: '20px' }}>
      {children}
    </div>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeWrapper>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <div style={{ padding: '20px' }}>
            <Story />
          </div>
        </AppTheme>
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
