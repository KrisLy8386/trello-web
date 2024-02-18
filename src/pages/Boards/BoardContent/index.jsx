import Box from '@mui/material/Box'

function BoardContent() {
  return (
    <Box sx={{
        bgcolor: 'primary.main',
        width: '100%',
        height: (theme)=>`calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBardHeight})`,
        display: 'flex',
        alignItems:'center'
      }}>
        Board Content
      </Box>
  )
}

export default BoardContent