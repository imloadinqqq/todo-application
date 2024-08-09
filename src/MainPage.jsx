import { createTaskList, deleteTask, updateTask, createTask, getTasks, useQuery } from 'wasp/client/operations'
import { useState, useEffect } from 'react'

export const MainPage = () => {
  const { data: tasks, isLoading, error } = useQuery(getTasks)
  const [lists, setLists] = useState([])

  // Fetch task lists when component mounts
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch('/api/lists') // Adjust this endpoint based on your API
        const listsData = await response.json()
        setLists(listsData)
      } catch (err) {
        console.error('Error fetching lists:', err)
      }
    }

    fetchLists()
  }, [])

  return (
    <div className='form'>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!isLoading && !error && (
        <>
          <NewTaskForm lists={lists} />
          <NewListTaskForm />
          {tasks && <TasksList tasks={tasks} />}
        </>
      )}
    </div>
  ) 
}

const NewListTaskForm = () => {
  const [taskListName, setTaskListName] = useState('')

  const handleNameChange = (event) => {
    setTaskListName(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await createTaskList({ name: taskListName })
      setTaskListName('')
    } catch (err) {
      window.alert('Error: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="taskListName"
        type="text"
        value={taskListName}
        onChange={handleNameChange}
        placeholder="Enter task list name"
      />
      <input type="submit" value="Create task list" />
    </form>
  )
}

const TaskView = ({ task }) => {
  const handleIsDoneChange = async (event) => {
    try {
      await updateTask({
        id: task.id,
        isDone: event.target.checked,
      })
    } catch (error) {
      window.alert('Error while updating task: ' + error.message)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask(task.id)
    } catch (error) {
      window.alert('Error while deleting task: ' + error.message)
    }
  }

  return (
    <div>
      <input
        type="checkbox"
        id={String(task.id)}
        checked={task.isDone}
        onChange={handleIsDoneChange}
      />
      {task.description}
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}

const TasksList = ({ tasks }) => {
  if (!tasks?.length) return <div>No tasks</div>

  return (
    <div>
      {tasks.map((task, idx) => (
        <TaskView task={task} key={idx} />
      ))}
    </div>
  )
}

const NewTaskForm = ({ lists }) => {
  const [description, setDescription] = useState('')
  const [selectedList, setSelectedList] = useState('')

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleListChange = (event) => {
    setSelectedList(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await createTask({ description, listId: selectedList })
      setDescription('')
      setSelectedList('')
    } catch (err) {
      window.alert('Error: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="description"
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Enter task description"
      />
      <select name="list" value={selectedList} onChange={handleListChange}>
        <option value="">Select a list</option>
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.description}
          </option>
        ))}
      </select>
      <input type="submit" value="Create task" />
    </form>
  )
}

