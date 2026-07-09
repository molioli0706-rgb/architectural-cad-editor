import React from "react";
import "./App.css";

/**
 * Componente principal de la aplicación
 * Esta es la raíz de toda la interfaz de usuario
 */
function App(): React.ReactElement {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🏗️ Architectural CAD Editor</h1>
        <p>Editor profesional para planos arquitectónicos</p>
      </header>
      <main className="app-main">
        <div className="welcome-message">
          <h2>Bienvenido al Editor CAD</h2>
          <p>Infraestructura base creada. Los módulos se irán agregando progresivamente.</p>
          <ul>
            <li>✅ Motor geométrico configurado</li>
            <li>✅ TypeScript en strict mode</li>
            <li>✅ Estructura de directorios lista</li>
            <li>⏳ Componentes UI (próximamente)</li>
            <li>⏳ Sistema de muros (próximamente)</li>
          </ul>
        </div>
      </main>
      <footer className="app-footer">
        <p>Versión 0.1.0 - En desarrollo</p>
      </footer>
    </div>
  );
}

export default App;
