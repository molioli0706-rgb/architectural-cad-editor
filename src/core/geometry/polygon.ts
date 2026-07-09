/**
 * OPERACIONES CON POLÍGONOS Y BOUNDS
 *
 * Funciones para trabajar con polígonos, rectángulos y cálculos de área.
 */

import type { Vector2D, Polygon, Rectangle, PointLinePosition } from "./types";
import { GEOMETRY_EPSILON, PolygonOrientation, Convexity } from "./types";
import {
  createVector,
  addVectors,
  subtractVectors,
  scaleVector,
  crossProduct,
  dotProduct,
  magnitude,
  distance,
} from "./vector";
import {
  createInfiniteLine,
  infiniteLinesIntersection,
  nearestPointOnSegment,
  createLineSegment,
  pointLinePosition,
  infiniteLineFromPoints,
  pointOnSegment,
} from "./line";

/**
 * Crea un polígono
 */
export function createPolygon(vertices: readonly Vector2D[], closed = true): Polygon {
  return { vertices, closed };
}

/**
 * Calcula el área de un polígono (usando fórmula de Shoelace)
 */
export function polygonArea(polygon: Polygon): number {
  if (polygon.vertices.length < 3) return 0;

  let area = 0;
  const n = polygon.vertices.length;

  for (let i = 0; i < n; i++) {
    const v1 = polygon.vertices[i];
    const v2 = polygon.vertices[(i + 1) % n];
    area += v1.x * v2.y - v2.x * v1.y;
  }

  return Math.abs(area) / 2;
}

/**
 * Calcula el centroide de un polígono
 */
export function polygonCentroid(polygon: Polygon): Vector2D {
  if (polygon.vertices.length === 0) {
    return { x: 0, y: 0 };
  }

  let cx = 0,
    cy = 0;
  const n = polygon.vertices.length;

  for (let i = 0; i < n; i++) {
    const v1 = polygon.vertices[i];
    const v2 = polygon.vertices[(i + 1) % n];
    const cross = v1.x * v2.y - v2.x * v1.y;
    cx += (v1.x + v2.x) * cross;
    cy += (v1.y + v2.y) * cross;
  }

  const area = polygonArea(polygon);
  const factor = 1 / (6 * area);

  return {
    x: cx * factor,
    y: cy * factor,
  };
}

/**
 * Determina la orientación de un polígono
 */
export function polygonOrientation(polygon: Polygon): PolygonOrientation {
  if (polygon.vertices.length < 3) {
    return PolygonOrientation.COLLINEAR;
  }

  let sum = 0;
  const n = polygon.vertices.length;

  for (let i = 0; i < n; i++) {
    const v1 = polygon.vertices[i];
    const v2 = polygon.vertices[(i + 1) % n];
    sum += (v2.x - v1.x) * (v2.y + v1.y);
  }

  if (Math.abs(sum) < GEOMETRY_EPSILON) {
    return PolygonOrientation.COLLINEAR;
  }

  return sum > 0 ? PolygonOrientation.CLOCKWISE : PolygonOrientation.COUNTER_CLOCKWISE;
}

/**
 * Invierte el orden de los vértices de un polígono
 */
export function reversePolygon(polygon: Polygon): Polygon {
  return {
    vertices: [...polygon.vertices].reverse(),
    closed: polygon.closed,
  };
}

/**
 * Verifica si un punto está dentro de un polígono (algoritmo ray casting)
 */
export function pointInPolygon(point: Vector2D, polygon: Polygon): boolean {
  if (polygon.vertices.length < 3) return false;

  let inside = false;
  const n = polygon.vertices.length;

  for (let i = 0; i < n; i++) {
    const v1 = polygon.vertices[i];
    const v2 = polygon.vertices[(i + 1) % n];

    if (
      (v1.y > point.y) !== (v2.y > point.y) &&
      point.x < ((v2.x - v1.x) * (point.y - v1.y)) / (v2.y - v1.y) + v1.x
    ) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Calcula el bounding box de un polígono
 */
export function polygonBounds(polygon: Polygon): Rectangle {
  if (polygon.vertices.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = polygon.vertices[0].x;
  let minY = polygon.vertices[0].y;
  let maxX = minX;
  let maxY = minY;

  for (const vertex of polygon.vertices) {
    minX = Math.min(minX, vertex.x);
    minY = Math.min(minY, vertex.y);
    maxX = Math.max(maxX, vertex.x);
    maxY = Math.max(maxY, vertex.y);
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Calcula el bounding box desde dos puntos
 */
export function boundsFromPoints(p1: Vector2D, p2: Vector2D): Rectangle {
  return {
    minX: Math.min(p1.x, p2.x),
    minY: Math.min(p1.y, p2.y),
    maxX: Math.max(p1.x, p2.x),
    maxY: Math.max(p1.y, p2.y),
  };
}

/**
 * Verifica si un punto está dentro de un rectángulo
 */
export function pointInBounds(point: Vector2D, bounds: Rectangle): boolean {
  return point.x >= bounds.minX && point.x <= bounds.maxX && point.y >= bounds.minY && point.y <= bounds.maxY;
}

/**
 * Verifica si dos rectángulos se superponen
 */
export function boundsOverlap(b1: Rectangle, b2: Rectangle): boolean {
  return !(b1.maxX < b2.minX || b1.minX > b2.maxX || b1.maxY < b2.minY || b1.minY > b2.maxY);
}

/**
 * Calcula la unión de dos rectángulos
 */
export function unionBounds(b1: Rectangle, b2: Rectangle): Rectangle {
  return {
    minX: Math.min(b1.minX, b2.minX),
    minY: Math.min(b1.minY, b2.minY),
    maxX: Math.max(b1.maxX, b2.maxX),
    maxY: Math.max(b1.maxY, b2.maxY),
  };
}

/**
 * Calcula la intersección de dos rectángulos
 */
export function intersectionBounds(b1: Rectangle, b2: Rectangle): Rectangle | null {
  const minX = Math.max(b1.minX, b2.minX);
  const minY = Math.max(b1.minY, b2.minY);
  const maxX = Math.min(b1.maxX, b2.maxX);
  const maxY = Math.min(b1.maxY, b2.maxY);

  if (minX > maxX || minY > maxY) {
    return null;
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Calcula el ancho de un rectángulo
 */
export function boundsWidth(bounds: Rectangle): number {
  return bounds.maxX - bounds.minX;
}

/**
 * Calcula el alto de un rectángulo
 */
export function boundsHeight(bounds: Rectangle): number {
  return bounds.maxY - bounds.minY;
}

/**
 * Calcula el centro de un rectángulo
 */
export function boundsCentre(bounds: Rectangle): Vector2D {
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };
}

/**
 * Verifica si un polígono es convexo
 */
export function isConvexPolygon(polygon: Polygon): boolean {
  if (polygon.vertices.length < 3) return false;

  let sign: number | null = null;
  const n = polygon.vertices.length;

  for (let i = 0; i < n; i++) {
    const v1 = polygon.vertices[i];
    const v2 = polygon.vertices[(i + 1) % n];
    const v3 = polygon.vertices[(i + 2) % n];

    const cross = crossProduct(subtractVectors(v2, v1), subtractVectors(v3, v2));

    if (Math.abs(cross) > GEOMETRY_EPSILON) {
      if (sign === null) {
        sign = cross > 0 ? 1 : -1;
      } else if ((cross > 0 ? 1 : -1) !== sign) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Calcula el perímetro de un polígono
 */
export function polygonPerimeter(polygon: Polygon): number {
  if (polygon.vertices.length < 2) return 0;

  let perimeter = 0;
  const n = polygon.vertices.length;

  for (let i = 0; i < n; i++) {
    const v1 = polygon.vertices[i];
    const v2 = polygon.vertices[(i + 1) % n];
    perimeter += distance(v1, v2);
  }

  return perimeter;
}

/**
 * Expande un rectángulo por una distancia
 */
export function expandBounds(bounds: Rectangle, distance: number): Rectangle {
  return {
    minX: bounds.minX - distance,
    minY: bounds.minY - distance,
    maxX: bounds.maxX + distance,
    maxY: bounds.maxY + distance,
  };
}

/**
 * Obtiene las esquinas de un rectángulo
 */
export function boundsCorners(bounds: Rectangle): Vector2D[] {
  return [
    createVector(bounds.minX, bounds.minY),
    createVector(bounds.maxX, bounds.minY),
    createVector(bounds.maxX, bounds.maxY),
    createVector(bounds.minX, bounds.maxY),
  ];
}

/**
 * Calcula la distancia más corta desde un punto a un polígono
 */
export function distanceToPolygon(point: Vector2D, polygon: Polygon): number {
  if (polygon.vertices.length === 0) return 0;
  if (pointInPolygon(point, polygon)) return 0;

  let minDist = Infinity;
  const n = polygon.vertices.length;

  for (let i = 0; i < n; i++) {
    const v1 = polygon.vertices[i];
    const v2 = polygon.vertices[(i + 1) % n];
    const segment = createLineSegment(v1, v2);
    const nearest = nearestPointOnSegment(segment, point);
    minDist = Math.min(minDist, nearest.distance);
  }

  return minDist;
}
