import Box  from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext, 
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({board}) {
  //https://docs.dndkit.com/api-documentation/sensors
  // const pointerSensor = useSensor(PointerSensor,{
  //     // Require the mouse to move by 10 pixels before activating
  //     activationConstraint: {
  //       distance: 10,
  //     },})

  const mouseSensor = useSensor(MouseSensor,{
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },})

  const touchSensor = useSensor(TouchSensor,{
    // Require the touch to be at least 250ms and tolerance as 500 before activating
    activationConstraint: {
      delay: 250, tolerance: 500
    },})   

  const sensors = useSensors(mouseSensor,touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(()=>{
    setOrderedColumns( mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  },[board])

  const handleDragEnd = (event) =>{
    // console.log('handleDragEnd: ', event)
    const {active, over} = event

    //If the over id is out of scopre, return
    if(!over) return

    //if the final position after dragging is different with the intial one, perform the move
    if (active.id !== over.id){
      //get the active position
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      //get the over position
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      //rearrange the collumns using arrayMove of DND Kit
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // these lines below are used for API processing
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log(dndOrderedColumns)
      // console.log(dndOrderedColumnsIds)

      //update the state for ordered columns
      setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box 
      sx={{
          bgcolor: (theme) => (theme.palette.mode==='dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme)=> theme.trello.boardContentHeight,
          p: '10px 0'
        }}>
        <ListColumns columns = {orderedColumns}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent
