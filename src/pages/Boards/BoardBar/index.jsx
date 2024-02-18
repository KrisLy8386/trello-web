import Box from '@mui/material/Box'

function BoardBar() {
  return (
    <Box sx={{
        bgcolor: 'primary.dark',
        width: '100%',
        height: (theme)=>theme.trello.boardBardHeight,
        display: 'flex',
        alignItems:'center'
      }}>
        Board Bar
      </Box>
  )
}

export default BoardBar
