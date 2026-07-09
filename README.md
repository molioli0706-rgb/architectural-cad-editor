# Architectural CAD Editor

Editor CAD profesional para planos arquitectónicos, optimizado para tablets Android con funcionamiento offline.

## Características

### Sistema de Muros
- ✅ Creación mediante arrastre
- ✅ Cotas automáticas
- ✅ Edición de dimensiones
- ✅ Modificación de espesor
- ✅ Uniones automáticas
- ✅ Limpieza de esquinas

### Biblioteca Arquitectónica
- ✅ Puertas y ventanas
- ✅ Columnas y escaleras
- ✅ Arcos y aberturas
- ✅ Inserción inteligente con vanos automáticos

### Simbología Eléctrica
- ✅ Normas IRAM
- ✅ Reglamentación AEA Argentina
- ✅ Interruptores, tomacorrientes, etc.

### Herramientas
- ✅ Lápiz, marcador, resaltador
- ✅ Borrador
- ✅ Gestos multitáctiles
- ✅ Zoom y desplazamiento

### Almacenamiento
- ✅ IndexedDB para datos offline
- ✅ Exportación a PNG, PDF, SVG
- ✅ Guardado automático

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **State**: Zustand
- **Testing**: Vitest
- **Storage**: IndexedDB
- **Rendering**: Canvas 2D / SVG

## Configuración Inicial

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Tests
npm run test

# Linting
npm run lint
```

## Estructura del Proyecto

```
src/
├── core/         # Motor geométrico
├── engine/       # Motor CAD
├── features/     # Características específicas
├── storage/      # Almacenamiento
├── ui/           # Interfaz de usuario
├── services/     # Servicios
└── utils/        # Utilidades
```

## Desarrollo

### Modalidad de Desarrollo

Este proyecto se desarrolla incrementalmente, módulo por módulo:

1. Motor geométrico
2. Motor gráfico
3. Sistema de muros
4. Herramientas de edición
5. Biblioteca arquitectónica
6. Sistema eléctrico
7. Exportación
8. Optimización táctil

### Principios Clave

- ✅ Separación clara de responsabilidades
- ✅ Funciones puras en el motor geométrico
- ✅ Inmutabilidad de datos
- ✅ Type-safe con TypeScript strict
- ✅ Pruebas unitarias desde el inicio
- ✅ Código preparado para producción

## Licencia

Privado - Proyecto en desarrollo

## Contacto

Desarrollado por: molioli0706-rgb
