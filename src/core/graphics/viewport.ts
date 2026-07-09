/**
 * UTILIDADES DE TRANSFORMACIÓN Y VIEWPORT
 *
 * Funciones para trabajar con transformaciones de vista y proyecciones
 */

import type { Vector2D, Rectangle } from "./types";

export interface Viewport {
  readonly width: number;
  readonly height: number;
  readonly zoom: number;
  readonly centerX: number;
  readonly centerY: number;
}

/**
 * Crea un viewport
 */
export function createViewport(
  width: number,
  height: number,
  zoom = 1,
  centerX = 0,
  centerY = 0
): Viewport {
  return { width, height, zoom, centerX, centerY };
}

/**
 * Convierte coordenadas de mundo a coordenadas de pantalla
 */
export function worldToScreen(point: Vector2D, viewport: Viewport): Vector2D {
  return {
    x: (point.x - viewport.centerX) * viewport.zoom + viewport.width / 2,
    y: (point.y - viewport.centerY) * viewport.zoom + viewport.height / 2,
  };
}

/**
 * Convierte coordenadas de pantalla a coordenadas de mundo
 */
export function screenToWorld(point: Vector2D, viewport: Viewport): Vector2D {
  return {
    x: (point.x - viewport.width / 2) / viewport.zoom + viewport.centerX,
    y: (point.y - viewport.height / 2) / viewport.zoom + viewport.centerY,
  };
}

/**
 * Obtiene el área visible en coordenadas de mundo
 */
export function getVisibleBounds(viewport: Viewport): Rectangle {
  const halfWidth = (viewport.width / 2) / viewport.zoom;
  const halfHeight = (viewport.height / 2) / viewport.zoom;

  return {
    minX: viewport.centerX - halfWidth,
    minY: viewport.centerY - halfHeight,
    maxX: viewport.centerX + halfWidth,
    maxY: viewport.centerY + halfHeight,
  };
}

/**
 * Hace zoom hacia un punto
 */
export function zoomAt(point: Vector2D, factor: number, viewport: Viewport): Viewport {
  const newZoom = viewport.zoom * factor;
  const worldPoint = screenToWorld(point, viewport);

  return {
    ...viewport,
    zoom: newZoom,
    centerX: worldPoint.x,
    centerY: worldPoint.y,
  };
}

/**
 * Desplaza el viewport
 */
export function pan(dx: number, dy: number, viewport: Viewport): Viewport {
  return {
    ...viewport,
    centerX: viewport.centerX - dx / viewport.zoom,
    centerY: viewport.centerY - dy / viewport.zoom,
  };
}
