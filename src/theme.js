import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = extendTheme({
    trello:{
      appBarHeight: '58px',
      boardBardHeight: '60px'
    },
    colorSchemes: {
      light: {},
      dark: {}
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            '*::-webkit-scrollbar': {
              width: '8px',
              height: '8px'
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: '#dcdde1',
              borderRadius: '8px'
            },
            '*::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'white'
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderWidth: '0.5px',
            '&:hover': { borderWidth: '0.5px' }
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { fontSize: '0.875rem' }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            '&.MuiTypography-body1': { fontSize: '0.875rem' }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
            '& fieldset': { borderWidth: '0.5px' },
            '&:hover fieldset': { borderWidth: '1px' },
            '&.Mui-focused fieldset': { borderWidth: '1px' }
          }
        }
      }
    }
  })

export default theme;
