/* eslint-disable react/prop-types */
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Box  from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import { Button } from '@mui/material'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'

function Column({column}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
      id: column._id, 
      data: {...column}
    })
    const dndKitColumnStyles = {
      // touchAction: 'none',
      transform: CSS.Translate.toString(transform),
      transition,
      //Fix the issue of needing to drag in the middle of the long column to move. Used along with {...listeners} inserted in <Box> not <dev>
      height: '100%',
      opacity: isDragging? 0.5: undefined
    }

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  
    const [newCardTitle, setNewCardTitle] = useState('')
  
    const addNewCard = () => {
      if (!newCardTitle) {
        toast.error('Please enter Card Title!', { position: 'bottom-right' })
        return
      }
  
      // Tạo dữ liệu Card để gọi API
      // const newCardData = {
      //   title: newCardTitle,
      //   columnId: column._id
      // }
  
      /**
       * Gọi lên props function createNewCard nằm ở component cha cao nhất (boards/_id.jsx)
       * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ với mình thì chúng ta sẽ đưa dữ liệu Board ra ngoài Redux Global Store,
       * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ :D)
       * - Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
       */
      // createNewCard(newCardData)
  
      // Đóng trạng thái thêm Card mới & Clear Input
      toggleOpenNewCardForm()
      setNewCardTitle('')
    }

  return (
    <div         
      ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
         {...listeners}
        sx={{
          minWidth:'300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode==='dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
          {/* Box Column Header */}
          <Box
            sx={{
              height: (theme) => theme.trello.columnHeaderHeight,
              p: 2,
              display: 'flex',
              alignItems:'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant='h6' sx = {{fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'}}>{column?.title}</Typography>

            <Box>
              <Tooltip 
              title = "More Options"
              >
              <ExpandMoreIcon
                  sx={{
                    color:'text.primary',
                    cursor: 'pointer'
                  }}
                  id="basic-column-dropdown"
                  aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                  id="basic-menu-workspaces"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                  'aria-labelledby': 'basic-button-workspaces'
                  }}
              >
                  <MenuItem>
                      <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Add new card</ListItemText>
                  </MenuItem>
                  <MenuItem>
                      <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                      <ListItemText>Cut</ListItemText>
                  </MenuItem>
                  <MenuItem>
                      <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                      <ListItemText>Copy</ListItemText>
                  </MenuItem>
                  <MenuItem>
                      <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                      <ListItemText>Paste</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                      <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Remove this column</ListItemText>
                  </MenuItem>                
                  <MenuItem>
                      <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                      <ListItemText>Archive this column</ListItemText>
                  </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Box Column List Cards */}
          <ListCards cards={orderedCards}/>
    
          {/* Box Column Footer */}
          <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}>
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant="contained" color="success" size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add</Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>          
      </Box> 
    </div>
     
  )
}

export default Column
