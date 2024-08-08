export const createTask = async (args, context) => {
  if (!args.description || args.description.trim() === "") {
    throw new Error("Description is required");
  }

  return context.entities.Task.create({
    data: { description: args.description },
  });
}


export const updateTask = async ({ id, isDone }, context) => {
  return context.entities.Task.update({
    where: { id },
    data: {
      isDone: isDone,
    },
  })
}

export const deleteTask = async (id, context) => {
  return context.entities.Task.delete({
    where: { id },
  })
}


//export const createTaskList =
