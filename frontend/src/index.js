import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/styles.css';
import App from './App';
import Login from './components/Login';

function Root() {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('usuario'))
  );

  // 🔐 Si NO hay usuario → LOGIN
  if (!usuario) {
    return <Login onLoginExitoso={setUsuario} />;
  }

  // ✅ Si hay usuario → APP
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
