import { useState, useEffect } from 'react';

function App() {

  const [darkMode, setDarkMode] = useState(false);

  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    setCategories(savedCategories);
    setTasks(savedTasks);
    setDarkMode(savedDarkMode);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isInitialized]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newCategory = {
      id: Date.now().toString(),
      name: trimmed,
    };
    setCategories([...categories, newCategory]);
  };

  const addTask = (categoryId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTask = {
      id: Date.now().toString(),
      categoryId,
      text: trimmed,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const deleteCategory = (categoryId) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    setTasks((prev) => prev.filter((task) => task.categoryId !== categoryId));
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // NOVO: Funções para subir/descrescer categorias
  const moveCategoryUp = (index) => {
    if (index === 0) return; // já está no topo
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
    setCategories(newCategories);
  };

  const moveCategoryDown = (index) => {
    if (index === categories.length - 1) return; // já está no fim
    const newCategories = [...categories];
    [newCategories[index + 1], newCategories[index]] = [newCategories[index], newCategories[index + 1]];
    setCategories(newCategories);
  };

  // Estilos dinâmicos baseados no tema
  const backgroundColor = darkMode ? '#121212' : '#f9f9f9';
  const textColor = darkMode ? '#eee' : '#333';
  const cardBackground = darkMode ? '#1e1e1e' : '#fff';
  const buttonBackground = darkMode ? '#bb86fc' : '#007bff';
  const buttonTextColor = 'white';

  const buttonStyle = {
    backgroundColor: buttonBackground,
    color: buttonTextColor,
    border: 'none',
    padding: '5px 10px',
    marginLeft: '5px',
    cursor: 'pointer',
    borderRadius: '4px',
  };

  const darkModeButtonStyle = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: textColor,
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    transition: 'background-color 0.3s',
  };

  const AddCategory = () => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      addCategory(input);
      setInput('');
    };

    return (
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Nova categoria"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '70%' }}
        />
        <button type="submit" style={buttonStyle}>
          Adicionar Categoria
        </button>
      </form>
    );
  };

  const AddTask = ({ categoryId }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      addTask(categoryId, input);
      setInput('');
    };

    return (
      <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '70%' }}
        />
        <button type="submit" style={buttonStyle}>
          Adicionar
        </button>
      </form>
    );
  };

  const TaskList = ({ categoryId }) => {
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState('');

    const filteredTasks = tasks.filter((task) => {
      const matchCategory = task.categoryId === categoryId;
      const matchFilter =
        filter === 'all' ||
        (filter === 'done' && task.completed) ||
        (filter === 'pending' && !task.completed);
      return matchCategory && matchFilter;
    });

    const startEditing = (task) => {
      setEditingTaskId(task.id);
      setEditingText(task.text);
    };

    const cancelEditing = () => {
      setEditingTaskId(null);
      setEditingText('');
    };

    const saveEditing = () => {
      if (!editingText.trim()) return;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId ? { ...task, text: editingText.trim() } : task
        )
      );
      cancelEditing();
    };

    if (filteredTasks.length === 0) {
      return <p style={{ fontStyle: 'italic' }}>Nenhuma tarefa nesta categoria.</p>;
    }

    return (
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {filteredTasks.map((task) => (
          <li key={task.id} style={{ marginBottom: '0.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditing();
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    onBlur={saveEditing}
                    autoFocus
                    style={{
                      flexGrow: 1,
                      padding: '4px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  />
                  <button
                    onClick={cancelEditing}
                    style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <label
                    style={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      flexGrow: 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {task.text}
                  </label>
                  <div>
                    <button
                      onClick={() => startEditing(task)}
                      style={{ ...buttonStyle, backgroundColor: '#ffc107', marginRight: '0.5rem' }}
                      title="Editar tarefa"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                      title="Excluir tarefa"
                    >
                      ❌
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'Arial, sans-serif',
        backgroundColor,
        color: textColor,
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <h1>Gerenciador de Tarefas por Categoria</h1>

      
      <button
        onClick={toggleDarkMode}
        style={darkModeButtonStyle}
        aria-label={darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
        title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = darkMode ? '#333' : '#ddd')
        }
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <AddCategory />

      <div style={{ marginBottom: '1rem' }}>
        <strong>Filtrar tarefas: </strong>
        <button onClick={() => setFilter('all')} style={buttonStyle}>
          Todas
        </button>
        <button onClick={() => setFilter('done')} style={buttonStyle}>
          Concluídas
        </button>
        <button onClick={() => setFilter('pending')} style={buttonStyle}>
          Pendentes
        </button>
      </div>

      {categories.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>Crie sua primeira categoria para começar.</p>
      ) : (
        categories.map((cat, index) => (
          <div
            key={cat.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              backgroundColor: cardBackground,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{cat.name}</h2>
              <div>
                <button
                  onClick={() => moveCategoryUp(index)}
                  style={{ ...buttonStyle, marginRight: '0.5rem' }}
                  disabled={index === 0}
                  title="Mover categoria para cima"
                >
                  ⬆️
                </button>
                <button
                  onClick={() => moveCategoryDown(index)}
                  style={{ ...buttonStyle, marginRight: '0.5rem' }}
                  disabled={index === categories.length - 1}
                  title="Mover categoria para baixo"
                >
                  ⬇️
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                  title="Excluir categoria"
                >
                  ❌
                </button>
              </div>
            </div>

            <AddTask categoryId={cat.id} />
            <TaskList categoryId={cat.id} />
          </div>
        ))
      )}
    </div>
  );
}

export default App;
