import { createTaskList, deleteTask, updateTask, createTask, getTasks, useQuery } from 'wasp/client/operations'
import { useState } from 'react'

export const MainPage = () => {
  const { data: tasks, isLoading, error } = useQuery(getTasks)

  return (
    <div className='form'>
      <NewTaskForm />
      {tasks && <TasksList tasks={tasks} />}

      {isLoading && 'Loading...'}
      {error && 'Error: ' + error}
    </div>
  ) 
}

const NewListTaskForm = () => {
  const [taskListName, setTaskListName] = useState('');

  const handleNameChange = (event) => {
    setTaskListName(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle submit logic...
  };

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
  );
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

  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const taskListName = event.target.taskListName.value;
    // Reset form
    event.target.reset();
    // Create task list with the name
    await createTaskList({ name: taskListName });
  } catch (err) {
    window.alert('Error: ' + err.message);
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

const NewTaskForm = () => {
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const target = event.target
      const description = target.description.value
      target.reset()
      await createTask({ description })
    } catch (err) {
      window.alert('Error: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="description" type="text" defaultValue="" />
      <input type="submit" value="Create task" />
    </form>
  )
}

