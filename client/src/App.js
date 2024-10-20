import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = "https://to-do-application-sepia.vercel.app";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [formDataEdit, setFormDataEdit] = useState({ title: "", _id: "" });
  const [dataList, setDataList] = useState([]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    setFormData({ title: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/tasks", formData);
      alert(response.data.message);
      setAddSection(false);
      getFetchData();
      setFormData({ title: "" });
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const getFetchData = async () => {
    try {
      const response = await axios.get("/tasks");
      setDataList(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    const response = await axios.delete(`/tasks/${id}`);
    alert(response.data.message);
    getFetchData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await axios.put(`/tasks/${formDataEdit._id}`, { title: formDataEdit.title });
    alert(response.data.message);
    getFetchData();
    setEditSection(false);
  };

  const handleEditOnChange = (e) => {
    const { value } = e.target;
    setFormDataEdit({ ...formDataEdit, title: value });
  };

  const handleEdit = (task) => {
    setFormDataEdit(task);
    setEditSection(true);
  };

  const handleComplete = async (id) => {
    await axios.patch(`/tasks/${id}/complete`);
    getFetchData();
  };

  return (
    <div className="container">
      <button className="btn btn-add" onClick={() => setAddSection(true)}>Add Task</button>

      {addSection && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" value={formData.title} onChange={handleOnChange} placeholder="Task Title" required />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setAddSection(false)}>Cancel</button>
        </form>
      )}

      {editSection && (
        <form onSubmit={handleUpdate}>
          <input type="text" name="title" value={formDataEdit.title} onChange={handleEditOnChange} placeholder="Edit Task Title" required />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditSection(false)}>Cancel</button>
        </form>
      )}

      <div className='tableContainer'>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataList.length ? (
              dataList.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.completed ? 'Completed' : 'Pending'}</td>
                  <td>
                    <button onClick={() => handleEdit(task)}>Edit</button>
                    <button onClick={() => handleDelete(task._id)}>Delete</button>
                    <button onClick={() => handleComplete(task._id)}>
                      {task.completed ? 'Unmark' : 'Complete'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>No Tasks</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
