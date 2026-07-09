/**
 * OPERACIONES VECTORIALES
 *
 * Todas las operaciones devuelven nuevos objetos (inmutabilidad).
 * No modifican los vectores originales.
 *
 * Unidades: milímetros
 */

import type { Vector2D, GEOMETRY_EPSILON as GE } from "./types";
import { GEOMETRY_EPSILON, GEOMETRY_CONSTANTS } from "./types";

/**
 * Crea un nuevo vector
 */
export function createVector(x: number, y: number): Vector2D {
  return { x, y };
}

/**
 * Suma dos vectores
 */
export function addVectors(a: Vector2D, b: Vector2D): Vector2D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

/**
 * Resta dos vectores: a - b
 */
export function subtractVectors(a: Vector2D, b: Vector2D): Vector2D {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

/**
 * Multiplica un vector por un escalar
 */
export function scaleVector(v: Vector2D, scalar: number): Vector2D {
  return {
    x: v.x * scalar,
    y: v.y * scalar,
  };
}

/**
 * Calcula el producto escalar (dot product)
 */
export function dotProduct(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

/**
 * Calcula el producto cruzado 2D (pseudo-escalar)
 * Indica si la rotación de a hacia b es CCW (positivo) o CW (negativo)
 */
export function crossProduct(a: Vector2D, b: Vector2D): number {
  return a.x * b.y - a.y * b.x;
}

/**
 * Calcula la magnitud (longitud) de un vector
 */
export function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * Calcula la distancia entre dos puntos
 */
export function distance(a: Vector2D, b: Vector2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcula la distancia al cuadrado (más eficiente cuando no necesitas raíz)
 */
export function distanceSquared(a: Vector2D, b: Vector2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
}

/**
 * Normaliza un vector a longitud 1
 */
export function normalize(v: Vector2D): Vector2D {
  const mag = magnitude(v);
  if (mag < GEOMETRY_EPSILON) {
    return { x: 0, y: 0 };
  }
  return {
    x: v.x / mag,
    y: v.y / mag,
  };
}

/**
 * Crea un vector perpendicular (rotado 90° CCW)
 */
export function perpendicular(v: Vector2D): Vector2D {
  return {
    x: -v.y,
    y: v.x,
  };
}

/**
 * Crea un vector perpendicular (rotado 90° CW)
 */
export function perpendicularCW(v: Vector2D): Vector2D {
  return {
    x: v.y,
    y: -v.x,
  };
}

/**
 * Rota un vector por un ángulo (en radianes, CCW)
 */
export function rotateVector(v: Vector2D, angleRad: number): Vector2D {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
  };
}

/**
 * Calcula el ángulo entre dos vectores (en radianes, [0, π])
 */
export function angleBetween(a: Vector2D, b: Vector2D): number {
  const dot = dotProduct(normalize(a), normalize(b));
  const clamped = Math.max(-1, Math.min(1, dot));
  return Math.acos(clamped);
}

/**
 * Calcula el ángulo de un vector (en radianes, [-π, π])
 */
export function angle(v: Vector2D): number {
  return Math.atan2(v.y, v.x);
}

/**
 * Calcula el ángulo dirigido desde vector a hacia vector b (CCW positivo)
 */
export function angleTo(from: Vector2D, to: Vector2D): number {
  const a1 = angle(from);
  const a2 = angle(to);
  let a = a2 - a1;

  // Normalizar al rango [-π, π]
  while (a > Math.PI) a -= GEOMETRY_CONSTANTS.PI_2;
  while (a < -Math.PI) a += GEOMETRY_CONSTANTS.PI_2;

  return a;
}

/**
 * Verifica si dos vectores son aproximadamente iguales
 */
export function vectorsEqual(a: Vector2D, b: Vector2D, tolerance = GEOMETRY_EPSILON): boolean {
  return distance(a, b) < tolerance;
}

/**
 * Verifica si un vector es aproximadamente cero
 */
export function isZero(v: Vector2D, tolerance = GEOMETRY_EPSILON): boolean {
  return magnitude(v) < tolerance;
}

/**
 * Proyecta el vector a sobre el vector b
 */
export function projectVector(a: Vector2D, b: Vector2D): Vector2D {
  const bNorm = normalize(b);
  const projection = dotProduct(a, bNorm);
  return scaleVector(bNorm, projection);
}

/**
 * Lerp (interpolación lineal) entre dos vectores
 */
export function lerp(a: Vector2D, b: Vector2D, t: number): Vector2D {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

/**
 * Refleja un vector sobre una dirección normal
 */
export function reflect(v: Vector2D, normal: Vector2D): Vector2D {
  const n = normalize(normal);
  const d = dotProduct(v, n);
  return {
    x: v.x - 2 * d * n.x,
    y: v.y - 2 * d * n.y,
  };
}

/**
 * Calcula el ángulo entre tres puntos (en radianes)
 */
export function angleAtPoint(p1: Vector2D, vertex: Vector2D, p2: Vector2D): number {
  const v1 = subtractVectors(p1, vertex);
  const v2 = subtractVectors(p2, vertex);
  return angleBetween(v1, v2);
}

/**
 * Extiende un vector por una distancia
 */
export function extend(v: Vector2D, distance: number): Vector2D {
  const norm = normalize(v);
  return scaleVector(norm, magnitude(v) + distance);
}
