import axios from "axios";
import {CreateTodolist, DeleteTodolist, UpdateTodolistTitle} from "../stories/todolists-api.stories";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'b2cbf0c8-a18f-4c4c-a855-cbb200160c11'
    }
})

export const todolistApi = {
    getTodolists() {
        // return axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists',
        //      settings)
        return instance.get<Array<TodoListType>>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<CommonResponseType<{ item: TodoListType }>>('todo-lists',
            {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolistTitle(todolistId: string, title: string) {
        return instance.put<CommonResponseType>(`todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId: string){
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId: string,taskId: string){
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTask(todolistId: string, title: string){
        return instance.post<CommonResponseType<{item:TaskType }>>(`todo-lists/${todolistId}/tasks`,
            {title})
    },
    updateTaskTitle(todolistId: string,taskId: string, model: TaskModelForUpdate){
        return instance.put<CommonResponseType<{item:TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`,
            model)
    }
}
type TaskModelForUpdate={
    description: string
    title: string
    status: number
    priority: number
    startDate: string
    deadline: string
}
type CommonResponseType<T={}> = {
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
    data: T
}
type TodoListType = {
    id: string
    title: string
    addedDate: string
    order: number
}

// type CreateTodoListType = {
//     data: {
//         item: TodoListType
//     }
//     fieldsErrors: string[]
//     messages:string[]
//     resultCode: number
// }
// type DeleteUpdateTodoListType = {
//     data: {}
//     fieldsErrors: string[]
//     messages:string[]
//     resultCode: number
// }

type GetTasksResponse={
    items: TaskType[]
    totalCount: number
    error: string | null
}

export type TaskType={
    description: string
    title: string
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

