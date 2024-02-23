import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box  from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLE = {
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
    paddingX: '5px',
    borderRadius: '4px',
    '.MuiSvgIcon-root':{
      color: 'white' 
    },
    '&:hover':{
      backgroundColor: 'primary.50' 
    }
  };

function BoardBar() {
  return (
    <Box sx={{
        width: '100%',
        height: (theme)=>theme.trello.boardBardHeight,
        display: 'flex',
        alignItems:'center',
        justifyContent:'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode==='dark' ? '#34495e' : '#1976d2'),
        borderBottom: '1px solid white'
      }}>
        <Box sx={{display: 'flex', alignItems:'center', gap: 2}}>
          <Chip
          sx ={MENU_STYLE} 
            icon={<DashboardIcon />} 
            label="Krisly8386 MERN Stack Board"
            clickable 
          />
        <Chip
          sx ={MENU_STYLE} 
            icon={<VpnLockIcon />} 
            label="Public/Private Workspace"
            clickable 
        />
        <Chip
          sx ={MENU_STYLE} 
            icon={<AddToDriveIcon />} 
            label="Add to Google Drive"
            clickable 
        />
        <Chip
          sx ={MENU_STYLE} 
            icon={<BoltIcon />} 
            label="Automation"
            clickable 
        />
        <Chip
          sx ={MENU_STYLE} 
            icon={<FilterListIcon />} 
            label="Filters"
            clickable 
        />        
        </Box>
        <Box sx={{display: 'flex', alignItems:'center', gap: 2}}>
        <Button 
          variant="outlined" 
          startIcon = {<PersonAddIcon/>}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover':{
              borderColor: 'white'
            }
          }}
        >
          Invite
        </Button>
        <AvatarGroup 
          max={7}
          sx={{
            gap:'10px',
            '& .MuiAvatar-root':{
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none'
            }
          }}
          >
          <Tooltip title= "Krisly8386">
            <Avatar 
              alt="Krisly8386" 
              src="https://avatars.githubusercontent.com/u/139653151?s=400&u=23774049c98d44f43f9b5fc39414aacc5405c25b&v=4" 
            />
          </Tooltip>
          <Tooltip title= "Krisly8386">
            <Avatar 
              alt="Krisly8386" 
              src="https://avatars.githubusercontent.com/u/113641497?v=4" 
            />
          </Tooltip>
          <Tooltip title= "Krisly8386">
            <Avatar 
              alt="Krisly8386" 
              src="https://avatars.githubusercontent.com/u/139653151?s=400&u=23774049c98d44f43f9b5fc39414aacc5405c25b&v=4" 
            />
          </Tooltip>
          <Tooltip title= "Krisly8386">
            <Avatar 
              alt="Krisly8386" 
              src="https://avatars.githubusercontent.com/u/113641497?v=4" 
            />
          </Tooltip>
          <Tooltip title= "Krisly8386">
            <Avatar 
              alt="Krisly8386" 
              src="https://avatars.githubusercontent.com/u/139653151?s=400&u=23774049c98d44f43f9b5fc39414aacc5405c25b&v=4" 
            />
          </Tooltip>
          <Tooltip title= "Krisly8386">
            <Avatar 
              alt="Krisly8386" 
              src="https://avatars.githubusercontent.com/u/113641497?v=4" 
            />
          </Tooltip>
          <Tooltip title= "Krisly8386">
            <Avatar 
              alt="Krisly8386" 
              src="https://avatars.githubusercontent.com/u/139653151?s=400&u=23774049c98d44f43f9b5fc39414aacc5405c25b&v=4" 
            />
          </Tooltip>
          <Tooltip title= "Krisly8386">
            <Avatar 
              alt="Krisly8386" 
              src="https://avatars.githubusercontent.com/u/113641497?v=4" 
            />
          </Tooltip>
        </AvatarGroup>          
        </Box>
    </Box>
  )
}

export default BoardBar
