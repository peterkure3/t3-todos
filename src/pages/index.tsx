import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { Header } from '~/components/header';
import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [todos, setTodos] = useState([]);

  const ctx = React.useContext(api);

  const { data, isLoading: todosLoading, refetch } = 
      api.todo.getTodosByUser.useQuery(session?.user?.id ?? "");

  React.useEffect(() => {
    if (data) {
      setTodos(data);
    }
  }, [data]);

  const { mutate: createMutate } = api.todo.createTodo.useMutation({
    onSuccess: () => {
      setTitle("");
      setDetails("");
      refetch(); // Reload data after creating a new todo
    }
  });

  const { mutate: deleteMutate } = api.todo.deleteTodo.useMutation({
    onSuccess: () => {
      refetch(); // Reload data after deleting a todo
    }
  });

  const { mutate: updateMutate } = api.todo.updateTodo.useMutation({
    onSuccess: () => {
      refetch(); // Reload data after updating a todo
    }
  });

  const handleCheckboxChange = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
    updateMutate({ id: id, done: !todos.find((todo) => todo.id === id).done });
  };

  return (
    <div className="flex-grow flex flex-col justify-center items-center">
      <Header/>
      <div className="w-full md:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
        {todos?.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between mb-2">
            <input 
              type="checkbox"
              style={{ zoom: 1.5 }}
              checked={todo.done}
              onChange={() => handleCheckboxChange(todo.id)}
            />
            <p className="mx-2">{todo.title}</p>
            <button 
              onClick={() => deleteMutate(todo.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="w-full md:w-1/2 bg-gray-100 p-4 mt-4 rounded-lg shadow-md">
        <input 
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2"
        />
        <textarea 
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2"
        />
        <button
          onClick={() => createMutate({ 
            userId: session?.user.id ?? "", 
            title: title, 
            details: details, 
            done: false 
          })}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}
