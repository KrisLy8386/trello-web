import Box  from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import {SortableContext, horizontalListSortingStrategy} from '@dnd-kit/sortable'

function ListColumns({columns}) {
  return (
    <SortableContext items={columns?.map(c=>c._id)} strategy={horizontalListSortingStrategy}>
      <Box 
    sx={{
        bgcolor: 'inherit',
        display: 'flex',
        width: '100%',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': {
          m: 2
        }       
      }}>
        {columns?.map(column=>(<Column key={column._id} column={column}/>))}

        {/* Add New Column CTA */}
      <Box 
        sx = {{
          minWidth:'200px',
          maxWidth: '200px',
          bgcolor: '#ffffff3d',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content'
        }}
      >
        <Button 
          sx={{
            color: 'white',
            width: '100%',
            justifyContent: 'flex-start',
            pl: 2.6,
            py: 1
          }}
          startIcon = {<NoteAddIcon/>}
        >Add new column</Button>
      </Box>

      </Box> 
    </SortableContext>
  )
}

export default ListColumns
