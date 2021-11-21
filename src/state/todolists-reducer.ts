import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {changeTaskTitleAC} from "./tasks-reducer";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    tdl: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodosType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOS": {
            return action.todos.map(tl => ({...tl, filter: 'all'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [
                {...action.tdl, filter: "all"}
                , ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        default:
            return state;
    }
}
export const setTodos = (todos: TodolistType[]) => {
    return {type: 'SET-TODOS', todos} as const
}
export type SetTodosType = ReturnType<typeof setTodos>
export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (tdl: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', tdl}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export const setTodosTC = () => (dispatch: Dispatch) => {
    const pr = todolistsAPI.getTodolists()
    pr.then((resp) => {
        dispatch(setTodos(resp.data))
    })
}

export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
    const pr = todolistsAPI.deleteTodolist(id)
    pr.then(() => {
        const action = removeTodolistAC(id);
        dispatch(action);
    })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    const pr = todolistsAPI.createTodolist(title)
    pr.then((resp) => {
        const action = addTodolistAC(resp.data.data.item);
        dispatch(action);
    })
}


export const updateTdlTitleTC = (id: string, title: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    todolistsAPI.updateTodolist(id, title)
        .then(() => {
            const action = changeTodolistTitleAC(id, title);
            dispatch(action);
        })
}


