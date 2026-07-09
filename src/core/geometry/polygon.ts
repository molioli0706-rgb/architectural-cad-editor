/**
 * OPERACIONES CON POLÍGONOS
 *
 * Funciones para trabajar con polígonos, áreas y geometría compleja
 */

import type { Vector2D, Polygon, Rectangle, PolygonOrientation, Convexity } from "./types";
import { PolygonOrientation, Convexity, GEOMETRY_EPSILON } from "./types";
import { crossProduct, subtractVectors, magnitude } from "./vector";

/**
 * Crea un polígono
 */
export function createPolygon(vertices: Vector2D[], closed = true): Polygon {
  return { vertices, closed };
}

/**
 * Calcula el área de un polígono usando la fórmula del shoelace
 */
export function polygonArea(polygon: Polygon): number {
  const vertices = polygon.vertices;
  if (vertices.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % vertices.length];
    area += v1.x * v2.y - v2.x * v1.y;
  }
  return Math.abs(area) / 2;
}

/**
 * Calcula el perímetro de un polígono
 */
export function polygonPerimeter(polygon: Polygon): number {
  const vertices = polygon.vertices;
  if (vertices.length < 2) return 0;

  let perimeter = 0;
  const end = polygon.closed ? vertices.length : vertices.length - 1;
  for (let i = 0; i < end; i++) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % vertices.length];
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  return perimeter;
}

/**
 * Obtiene el centroide de un polígono
 */
export function polygonCentroid(polygon: Polygon): Vector2D {
  const vertices = polygon.vertices;
  if (vertices.length === 0) return { x: 0, y: 0 };
  if (vertices.length === 1) return vertices[0];

  let cx = 0, cy = 0;
  for (const v of vertices) {
    cx += v.x;
    cy += v.y;
  }
  return {
    x: cx / vertices.length,
    y: cy / vertices.length,
  };
}

/**
 * Determina la orientación de un polígono
 */
export function polygonOrientation(polygon: Polygon): PolygonOrientation {
  const vertices = polygon.vertices;
  if (vertices.length < 3) return PolygonOrientation.COLLINEAR;

  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % vertices.length];
    area += v1.x * v2.y - v2.x * v1.y;
  }

  if (Math.abs(area) < GEOMETRY_EPSILON) {
    return PolygonOrientation.COLLINEAR;
  }
  return area > 0 ? PolygonOrientation.COUNTER_CLOCKWISE : PolygonOrientation.CLOCKWISE;
}

/**
 * Verifica si un punto está dentro del polígono (ray casting)
 */
export function pointInPolygon(point: Vector2D, polygon: Polygon): boolean {
  const vertices = polygon.vertices;
  if (vertices.length < 3) return false;

  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const v1 = vertices[i];
    const v2 = vertices[j];
    if (v1.y > point.y !== v2.y > point.y && point.x < ((v2.x - v1.x) * (point.y - v1.y)) / (v2.y - v1.y) + v1.x) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Obtiene el bounding box de un polígono
 */
export function polygonBounds(polygon: Polygon): Rectangle {
  const vertices = polygon.vertices;
  if (vertices.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = vertices[0].x, maxX = vertices[0].x;
  let minY = vertices[0].y, maxY = vertices[0].y;

  for (const v of vertices) {
    if (v.x < minX) minX = v.x;
    if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
  }

  return { minX, maxX, minY, maxY };
}

/**
 * Verifica si dos rectángulos se solapan
 */
export function boundsOverlap(b1: Rectangle, b2: Rectangle): boolean {
  return !(b1.maxX < b2.minX || b2.maxX < b1.minX || b1.maxY < b2.minY || b2.maxY < b1.minY);
}

/**
 * Verifica si un punto está en un rectángulo
 */
export function pointInBounds(point: Vector2D, bounds: Rectangle): boolean {
  return point.x >= bounds.minX && point.x <= bounds.maxX && point.y >= bounds.minY && point.y <= bounds.maxY;
}

/**
 * Expande un rectángulo
 */
export function expandBounds(bounds: Rectangle, amount: number): Rectangle {
  return {
    minX: bounds.minX - amount,
    minY: bounds.minY - amount,
    maxX: bounds.maxX + amount,
    maxY: bounds.maxY + amount,
  };
}
