export const getTasks = async (args, context) => {
  return context.entities.Task.findMany({
    orderBy: { id: 'asc' },
  })
}

export const getLists = async (args, context) => {
  return context.entities.List.findMany({
    orderBy: { id: 'asc' },
  })
}
