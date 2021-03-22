import React, {useState, useEffect} from 'react'
import axios from 'axios'

const DrfApiFetch = () =>  {

    const AUTH_TOKEN = process.env.REACT_APP_SAMPLE_AUTH_TOKEN
    const token = `Token ${AUTH_TOKEN}`

    const [tasks, setTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState([])
    const [editedTask, setEditedTask] = useState({id: '', title: ''})
    const [id, setId] = useState(1)

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/tasks/', {
            headers: {
                'Authorization': token
            }
        })
        .then(res => {
            setTasks(res.data)
        })

    }, [])

    const getTask = () => {
        axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`, {
            headers: {
                'Authorization': token
            }
        })
        .then(res => {
            setSelectedTask(res.data)
        })
        .catch(e => {
            console.log('存在しないIDです\n', e);
        })
    }

    const deleteTask = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`, {
            headers: {
                'Authorization': token
            }
        })
        .then(res => {
            setTasks(tasks.filter(task => task.id !== id))
            setSelectedTask([])
            if (editedTask.id === id) {
                setEditedTask({ id: '', title: ''});
              }
        })
        .catch(e => {
            console.log('削除に失敗しました\n', e);
        })
    }

    const createTask = (task) => {

        const data = {
            title: task.title
        }

        axios.post(`http://127.0.0.1:8000/api/tasks/`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => {
            setTasks([...tasks, res.data])
            setSelectedTask([])
            setEditedTask({id: '', title: ''})
        })
        .catch(e => {
            console.log('作成に失敗しました\n', e);
        })
    }

    const updateTask = (task) => {

        axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => {
            setTasks(tasks.map(task => (task.id === editedTask.id ? res.data : task)))
            setEditedTask({id: '', title: ''})
        })
        .catch(e => {
            console.log('更新に失敗しました\n', e);
        })
    }

    const handleInputChange = () => event => {
        const value = event.target.value
        const name = event.target.name
        setEditedTask({...editedTask, [name]:value})
    }

    return (
        <div>
            <ul>
                {
                    tasks.map(task => 
                    <li key={task.id}>
                        {task.id} {task.title}
                        <button onClick={() => deleteTask(task.id)}>
                            <i className="fas fa-trash-alt" />
                        </button>
                        <button onClick={() => setEditedTask(task)}>
                            <i className="fas fa-pen" />
                        </button>
                    </li>)
                }
            </ul>

            Set id <br/>
            <input type="text" value={id} onChange={event => setId(event.target.value)} />
            <br/>
            <button type="button" onClick={() => getTask()}>Get Task</button>
            {/* <button type="button" onClick={() => deleteTask()}>Delete</button> */}
            
            <h3>{selectedTask.id} {selectedTask.title}</h3>

            <input type="text" name="title" value={editedTask.title} onChange={handleInputChange()} placeholder="New Task?" required/>
            { editedTask.id ? 
                <button type="button" onClick={() => updateTask(editedTask)}>Update</button> :
                <button type="button" onClick={() => createTask(editedTask)}>Create</button>
            }
    
        </div>
    )
}

export default DrfApiFetch
