/**
 * ALGORITMO DE CONVEXIDAD - Convex Hull (Graham Scan)
 *
 * Calcula la envoltura convexa de un conjunto de puntos
 */

import type { Vector2D, Polygon } from "./types";
import { crossProduct, subtractVectors } from "./vector";

/**
 * Calcula la envoltura convexa usando Graham Scan
 */
export function convexHull(points: Vector2D[]): Polygon {
  if (points.length < 3) {
    return {
      vertices: points,
      closed: true,
    };
  }

  const sorted = [...points].sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

  // Construcción de la parte inferior
  const lower: Vector2D[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && crossProduct(subtractVectors(lower[lower.length - 1], lower[lower.length - 2]), subtractVectors(p, lower[lower.length - 1])) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  // Construcción de la parte superior
  const upper: Vector2D[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && crossProduct(subtractVectors(upper[upper.length - 1], upper[upper.length - 2]), subtractVectors(p, upper[upper.length - 1])) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  // Eliminar último punto de cada parte porque se repite
  lower.pop();
  upper.pop();

  const vertices = lower.concat(upper);
  return {
    vertices,
    closed: true,
  };
}

/**
 * Calcula la envoltura convexa mínima usando Jarvis March
 * (menos eficiente pero más simple de entender)
 */
export function convexHullJarvis(points: Vector2D[]): Polygon {
  if (points.length < 3) {
    return {
      vertices: points,
      closed: true,
    };
  }

  // Encuentra el punto más a la izquierda
  let leftmost = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].x < points[leftmost].x || (points[i].x === points[leftmost].x && points[i].y < points[leftmost].y)) {
      leftmost = i;
    }
  }

  const hull: Vector2D[] = [];
  let current = leftmost;

  do {
    hull.push(points[current]);
    let next = (current + 1) % points.length;

    for (let i = 0; i < points.length; i++) {
      if (crossProduct(subtractVectors(points[next], points[current]), subtractVectors(points[i], points[current])) < 0) {
        next = i;
      }
    }

    current = next;
  } while (current !== leftmost);

  return {
    vertices: hull,
    closed: true,
  };
}
