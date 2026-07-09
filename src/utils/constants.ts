/**
 * Constantes globales de la aplicación
 */

// Versión de la aplicación
export const APP_VERSION = "0.1.0";
export const APP_NAME = "Architectural CAD Editor";

// Unidades de medida
export const DEFAULT_UNIT = "mm";
export const MM_TO_INCH = 0.0393701;
export const INCH_TO_MM = 25.4;

// Escala de zoom
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 10;
export const DEFAULT_ZOOM = 1;
export const ZOOM_STEP = 0.2;

// Tamaños predeterminados de muros (mm)
export const DEFAULT_WALL_THICKNESS = 150; // 15cm
export const MIN_WALL_THICKNESS = 50; // 5cm
export const MAX_WALL_THICKNESS = 500; // 50cm

// Puertas y ventanas
export const STANDARD_DOOR_WIDTH = 900; // 90cm
export const STANDARD_DOOR_HEIGHT = 2100; // 210cm
export const STANDARD_WINDOW_WIDTH = 1200; // 120cm
export const STANDARD_WINDOW_HEIGHT = 1500; // 150cm
export const STANDARD_WINDOW_SILL = 900; // 90cm desde el piso

// Storage
export const STORAGE_VERSION = 1;
export const DB_NAME = "ArchitecturalCAD";
export const DB_VERSION = 1;

// Tiempos
export const AUTOSAVE_INTERVAL = 30000; // 30 segundos
export const UNDO_HISTORY_MAX = 100;

// Tolerancias
export const SNAP_DISTANCE = 10; // mm
export const MERGE_DISTANCE = 5; // mm para fusionar puntos
