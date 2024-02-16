import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import HomeIcon from '@mui/icons-material/Home'
import { pink } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import {  useColorScheme } from '@mui/material/styles'
// import useMediaQuery from '@mui/material/useMediaQuery'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Box, Container } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

function ModeSelect() {

  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode)
  };                                                                                         

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light">
          <Box sx={{display:'flex', alignItems:'center', gap: 1}}>
            <LightModeIcon fontSize='small'/> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{display:'flex', alignItems:'center', gap: 1}}>
            <DarkModeOutlinedIcon fontSize='small'/> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{display:'flex', alignItems:'center', gap: 1}}>
            <SettingsBrightnessIcon fontSize='small'/> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function App() {
  return (
    <Container disableGutters maxWidth={false} sx={{height: '100vh'}}>
      <Box sx={{
        bgcolor: 'primary.light',
        width: '100%',
        height: (theme)=>theme.trello.appBarHeight,
        display: 'flex',
        alignItems:'center'
      }}>
        <ModeSelect/>
      </Box>
      <Box sx={{
        bgcolor: 'primary.dark',
        width: '100%',
        height: (theme)=>theme.trello.boardBardHeight,
        display: 'flex',
        alignItems:'center'
      }}>
        Board Bar
      </Box>
      <Box sx={{
        bgcolor: 'primary.main',
        width: '100%',
        height: (theme)=>`calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBardHeight})`,
        display: 'flex',
        alignItems:'center'
      }}>
        Board Content
      </Box>
    </Container>
  )
}

export default App
