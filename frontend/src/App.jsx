import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineDone, MdModeEditOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";
import { API_URL } from "./api.js";

function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [editedText, setEditedText] = useState("");

  const getTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("${API_URL}/todo/hi");
      setTodos(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch todos. Please try again later.")
    }finally{
      setLoading(false)
    }
  };


  useEffect(() => {
    getTodos();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if(!description.trim()) return;
    try {
      setError(null)
      const res = await axios.post("${API_URL}/todo", {
        description,
        completed: false,
      });
      setTodos([...todos,res.data])
      setDescription("");
    } catch (err) {
      console.error(err.message);
      setError("Failed to add todo.Please try again.")
    }
  };

  const saveEdit = async (id) => {
    try {
      setError(null)

      const currentTodo = todos.find((todos)=>todos.todo_id === id)
      const trimmedText = editedText.trim()

      if(currentTodo.description === trimmedText){
        setEditingTodo(null);
        setEditedText("");
        return; 
      } 
      await axios.put(`${API_URL}/todo/${id}`,{
        description:editedText,
      })
      setEditingTodo(null)
      setEditedText("")
      setTodos(todos.map((todos)=> todos.todo_id === id ?{...todos,description:editedText,completed:false}:todos));
      
    } catch (err) {
      console.error(err.message)
      setError("Failed to add todo.Please try again.")
    }
  }

  const deleteTodo = async (id) => {
    try {
      setError(null)
      await axios.delete(`${API_URL}/todo/${id}`)
      setTodos(todos.filter((todos)=>todos.todo_id !== id))
    } catch (err) {
      console.error(err.message)
      setError("Failed to add todo.Please try again.")
    }
  }

  const toggleCompleted = async(id) => {
    try {
      setError(null)
      const todo = todos.find((todos) => todos.todo_id === id)
      await axios.put(`${API_URL}/todo/${id}`,{
        description:todo.description,
        completed: !todo.completed,
      })
      setTodos(todos.map((todo)=>(todo.todo_id === id ? {...todo,completed: !todo.completed } : todo)))
    } catch (err) {
      console.error(err.message)
      setError("Failed to add todo.Please try again.")
    }
  }

  // same line me return ke age lekho agr ek line of code chalana hai wrna nahe chalta.
  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center">
      <div className="bg-gray-50 rounded-3xl shadow-xl w-full max-w-lg p-8 ">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Pern To Do App
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={onSubmitForm}
          className="flex items-center gap-2 shadow-sm border rounded-lg mb-6 p-2"
        >
          <input
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done"
            required
          />
          <button className="bg-blue-400 rounded-md px-2 py-2 hover:bg-blue-300 text-white font-medium cursor-pointer">
            Add To Task
          </button>
        </form>
        <div>
          {loading ? (
            <div>
              <p className="text-gray-600">loading task...</p>
            </div>
          ) : todos.length === 0 ? (
            <p className="text-gray-600">No Task availabe add a new task</p>
          ) : (
            <div className="flex flex-col gap-y-4">
              {todos.map((todos) => (
                <div key={todos.todo_id} className="pb-4">
                  {editingTodo===todos.todo_id?(
                    <div className="flex items-center gap-x-3">
                      <input className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner" type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)}/>
                      <div>
                      <button onClick={()=>saveEdit(todos.todo_id)}className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 mt-2 hover:bg-green-600 duration:200"><MdOutlineDone /></button> 
                      <button onClick={() => setEditingTodo(null)}className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 mt-2 hover:bg-gray-600 duration:200"><IoClose /></button>
                      </div>
                    </div>
                  ):(
                      <div className="flex justify-between items-center ">
                        <div className="flex items-center gap-x-4 overflow-hidden">
                    <button
                    onClick={() =>toggleCompleted(todos.todo_id)}
                      className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${todos.completed ? "bg-green-700 border-green-700 text-white" : "border-gray-300 hover:border-blue-400"}`}
                    >
                      {todos.completed && <MdOutlineDone />}
                    </button>
                    <span>{todos.description}</span>
                    </div>
                     <div className="flex gap-x-2">
                      <button
                        onClick={() => {
                          setEditingTodo(todos.todo_id);
                          setEditedText(todos.description);
                        }}
                        className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                      >
                        <MdModeEditOutline />
                      </button>
                      <button  onClick={() => deleteTodo(todos.todo_id)} className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-blue-50 duration-200">
                        <FaTrash />
                      </button>
                  </div> 
                      </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
