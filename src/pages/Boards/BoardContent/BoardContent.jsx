/* eslint-disable react/prop-types */
import Box  from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext, 
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  DragOverlay,
  pointerWithin,
  getFirstCollision,
  closestCorners} from '@dnd-kit/core'
import {
  MouseSensor,
  TouchSensor
} from '~/customLibraries/DndKitSensors'
import { cloneDeep, isEmpty } from 'lodash'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { generatePlaceholderCard } from '~/utils/formatters'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  //In the same exact moment, only one component either a card or a column is handled, not both.
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  //Last collision point
  const lastOverId = useRef(null)

  useEffect(()=>{
    setOrderedColumns( mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  },[board])

  // Find column by using card id
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //Update states when moving between 2 columns
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      //Find the index of the overCard in the destination column where it will be dropped.
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      
      // console.log('overCardIndex ', overCardIndex)
      
      //Find the new CardIndex getting the codes from the library
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // console.log('newCardIndex ', newCardIndex)

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      //Root Column
      if(nextActiveColumn){
        //Delete old card from the old column
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //if this is the last card to be dragged from this column, enable the placeholder.
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        //Update cardOrderIds for old column
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      //Destination Column
      if(nextOverColumn){
        //Check if the old card exists in this column, if yes, remove it.
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //Update the data
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        //Add the dragged card to the new over column
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        //Remove the card place holder to secure backend performance as placeholder card is not saved in the database.
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        //Update cardOrderIds for new column
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  //when start dragging a component
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //When dragging a card, save the inital column where the card belongs to
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  //When dragging a component
  const handleDragOver = (event) => {
    // console.log('handleDragOver ', event)
    //Do nothing to the column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    if (!active || !over) return

    //activeDraggingCardId is the dragged card
    const { id: activeDraggingCardId, data: {current: activeDraggingCardData}} = active
    
    //overCardId is the card interacting with activeDraggingCardId
    const {id: overCardId} = over

    //Find the active and over column to handle the drag over
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId) 

    //if there is no active and over column, return
    if (!activeColumn || !overColumn) return

    //Handle the drag between diffrent columns
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  //When finish dragging a component
  const handleDragEnd = (event) => {
    //console.log('handleDragEnd: ', event)

    const {active, over} = event

    //If the over id is out of scope, return
    if (!active || !over) return

    //Handle Cards drag and drop
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {

      //activeDraggingCardId is the dragged card
      const { id: activeDraggingCardId, data: {current: activeDraggingCardData}} = active
      
      //overCardId is the card interacting with activeDraggingCardId
      const {id: overCardId} = over
  
      //Find the active and over column to handle the drag over
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId) 
  
      //if there is no active and over column, return
      if (!activeColumn || !overColumn) return      

      //Handle the drag between diffrent columns
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      }
      else{
        //'draging in 1 column'
        //get the active position
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        //get the over position
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)  
        
        //rearrange the cards using arrayMove of DND Kit
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)

        setOrderedColumns(prevColumns => {
          // Clone OrderedColumnsState to the new one and return
          const nextColumns = cloneDeep(prevColumns)

          // Find the column that we drop
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // Update 2 values of cards and cardOrderIds in targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds

          // Return new states
          return nextColumns
        })

      }
    }

    //Handle Column drag and drop
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //if the final position after dragging is different with the intial one, perform the move
      if (active.id !== over.id){
        //get the active position
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        //get the over position
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        //rearrange the collumns using arrayMove of DND Kit
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // these lines below are used for API processing
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log(dndOrderedColumns)
        // console.log(dndOrderedColumnsIds)

        //update the state for ordered columns
        setOrderedColumns(dndOrderedColumns)
      }
    }    

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // console.log('activeDragItemId ', activeDragItemId)
  // console.log('activeDragItemType ', activeDragItemType)
  // console.log('activeDragItemData ', activeDragItemData)

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    // In the case of dragging columns, using closestCorners would be the best choice.
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Keep track of the collision points and return.
    const pointerIntersections = pointerWithin(args)

    // Fix the issue of fliclering by using DND-kit in this case:
    // -Dragging a card containing big cover image and dragging to the top to excape out of the dragging scope
    if (!pointerIntersections?.length) return

    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    // Look for the first overID in this pointerIntersections above
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      // This section of code is to fix the bug flickering. This could be ommited but this improves the performance significantly.
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before: ', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after: ', overId)
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    //If overID is null, return empty array to prevent page from crashing. 
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext 
      sensors={sensors}
      //closetCorner is used here in order to detect the card with higher length as this could be easily confused with column.
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <Box 
      sx={{
          bgcolor: (theme) => (theme.palette.mode==='dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme)=> theme.trello.boardContentHeight,
          p: '10px 0'
        }}>
        <ListColumns columns = {orderedColumns}/>
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
