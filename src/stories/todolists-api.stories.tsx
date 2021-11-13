import React, {useEffect, useState} from 'react'
import {todolistApi} from "../api/todolist-api";

export default {
    title: 'API'
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistApi.getTodolists()
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = 'dfghjkl'
        todolistApi.createTodolist(title)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    // useEffect(() => {
    //     const todolistId = '1efdbaf6-7622-4d69-beee-1e70ac0c291f'
    //     todolistApi.deleteTodolist(todolistId)
    //         .then((response) => {
    //             setState(response.data)
    //         })
    // }, [])
    const deleteTodolist = () => {
        todolistApi.deleteTodolist(todolistId)
            .then((response) => {
                setState(response.data)
            })
    }
    return <div> {JSON.stringify(state)}
        <input value={todolistId}
               onChange={(e) => setTodolistId(e.currentTarget.value)}/>
        <button onClick={deleteTodolist}>delete todolist</button>
    </div>

}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '37e19c7c-06c4-461b-80d1-acdd019f3760'
        const title = 'GOOOOAAALLLS'
        todolistApi.updateTodolistTitle(todolistId, title)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '924f52e0-2fa6-4a2f-9a96-444b118ae264'
        todolistApi.getTasks(todolistId)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '924f52e0-2fa6-4a2f-9a96-444b118ae264'
        const taskId = '03d5fd5d-47c9-4abc-bde8-0b9c4afbf807'
        todolistApi.deleteTask(todolistId, taskId)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '37e19c7c-06c4-461b-80d1-acdd019f3760'
        const title = 'GO TO ZOO'
        todolistApi.createTask(todolistId, title)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [status, setStatus] = useState<number>(0)
    const [priority, setPriority] = useState<number>(0)
    const [startDate, setStartDate] = useState<string>('')
    const [deadline, setDeadline] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')
    // useEffect(() => {
    //     const todolistId = '924f52e0-2fa6-4a2f-9a96-444b118ae264'
    //     const taskId = ''
    //     const title='newnewnewnew'
    //     todolistApi.updateTaskTitle(todolistId, taskId, title)
    //         .then((response) => {
    //             setState(response.data)
    //         })
    // }, [])
    const updateTask = () => {
        todolistApi.updateTaskTitle(todolistId, taskId, {
            title,
            deadline,
            description,
            priority,
            status,
            startDate
        })
            .then((response) => {
                setState(response.data)
            })
    }
    return <div> {JSON.stringify(state)}
        <div>
            <input placeholder={'todolistid'} value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <input placeholder={'taskId'} value={taskId}
                   onChange={(e) => {
                       setTaskId(e.currentTarget.value)
                   }}/>
            <input placeholder={'task title'} value={title}
                   onChange={(e) => {
                       setTitle(e.currentTarget.value)
                   }}/>
            <input placeholder={'description'} value={description}
                   onChange={(e) => {
                       setDescription(e.currentTarget.value)
                   }}/>
            <input placeholder={'status'} value={status}
                   onChange={(e) => {
                       setStatus(Number(e.currentTarget.value))
                   }}/>
            <input placeholder={'priority'} value={priority}
                   onChange={(e) => {
                       setPriority(+e.currentTarget.value)
                   }}/>
            <input placeholder={'startDate'} value={startDate}
                   onChange={(e) => {
                       setStartDate(e.currentTarget.value)
                   }}/>
            <input placeholder={'deadline'} value={deadline}
                   onChange={(e) => {
                       setDeadline(e.currentTarget.value)
                   }}/>
            <button onClick={updateTask}>update task</button>
        </div>

    </div>

}

