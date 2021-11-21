import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodosType} from './todolists-reducer';
import {GetTasksResponse, TaskPriorities, TaskStatuses, TaskType, todolistsAPI} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}


export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodosType
    | getTasksActionType
const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "GET-TASKS": {
            const stateCopy = {...state}
            stateCopy[action.todoId] = action.tasks
            return stateCopy
        }
        case "SET-TODOS": {
            const stateCopy = {...state};
            action.todos.forEach(tl => {
                stateCopy[tl.id] = [];
            })
            return stateCopy
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state};
            stateCopy[action.task.todoListId] = [action.task, ...stateCopy[action.task.todoListId]]
            return stateCopy
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.tdl.id]: []
            }

        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export type AddTaskActionType = ReturnType<typeof addTaskAC>

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}

export const getTasksAC = (todoId: string, tasks: TaskType[]) => {
    return {
        type: 'GET-TASKS',
        todoId, tasks
    } as const
}
export type getTasksActionType = ReturnType<typeof getTasksAC>

export const getTasksTC = (tdlId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(tdlId)
        .then(resp => {
            dispatch(getTasksAC(tdlId, resp.data.items))
        })
}
export const removeTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todoId, taskId).then(
        () => {
            dispatch(removeTaskAC(taskId, todoId));
        }
    )

}
export const addTaskTC = (tdlID: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(tdlID, title).then(
        (res) => {
            dispatch(addTaskAC(res.data.data.item));
        }
    )
}

export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва

        const task = getState().tasks[todolistId].find(t => {
            return t.id === taskId
        })

        if (task) {
            todolistsAPI.updateTask(todolistId, taskId, {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: status
            }).then(() => {
                const action = changeTaskStatusAC(taskId, status, todolistId)
                dispatch(action)
            })
        }
    }
}

export const updateTaskTitleTC = (id: string, todolistId: string, newTitle: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => {
        return t.id === id
    })
    if (task) {
        todolistsAPI.updateTask(todolistId, id, {
            title: newTitle,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status
        })
            .then(() => {
                const action = changeTaskTitleAC(id, newTitle, todolistId);
                dispatch(action);
            })
    }


}

