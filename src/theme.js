import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { deepOrange, orange, teal, cyan } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
    trello:{
      appBarHeight: '58px',
      boardBardHeight: '60px'
    },
    colorSchemes: {
      light: {
        palette: {
          primary: teal,
          secondary: deepOrange
        }
      },
      dark: {
        palette: {
          primary: cyan,
          secondary: orange
        }
      }
    },
    // ...other properties
    components: {
      // Name of the component
      MuiCssBaseline:{
        styleOverrides:{
          body: {
            '*::-webkit-scrollbar':{
              width: '8px',
              height: '8px'
            },
            '*::-webkit-scrollbar-thumb':{
              backgroundColor: '#bdc3c7',
              borderRadius: '8px'
            },
            '*::-webkit-scrollbar-thumb:hover':{
              backgroundColor: '#00b894',
              borderRadius: '8px'
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            textTransform: 'none',
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          // Name of the slot
          root:({theme})=>{
            return {
              color: theme.palette.primary.main,
              fontSize: '0.875rem'
            }
          }
        }
      },
      MuiOutlinedInput:{
        styleOverrides: {
          // Name of the slot
          root: ({theme})=>{
            return {
              color: theme.palette.primary.main,
              fontSize: '0.875rem',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.light
              },
              '&:hover': {
                '.MuiOutlinedInput-notchedOutline':{
                  borderColor: theme.palette.primary.main
                } 
              },
              '& fieldset': {
                borderWidth: '1px !important', 
              }
            }
          }
        }
      }
    }
  })

export default theme;
