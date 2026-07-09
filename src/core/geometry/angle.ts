/**
 * UTILIDADES DE ÁNGULOS
 *
 * Funciones para trabajar con ángulos en radianes y grados
 */

import type { Vector2D } from "./types";
import { GEOMETRY_CONSTANTS, GEOMETRY_ANGLE_EPSILON } from "./types";

/**
 * Convierte radianes a grados
 */
export function radiansToDegrees(radians: number): number {
  return radians * GEOMETRY_CONSTANTS.RADIANS_TO_DEGREES;
}

/**
 * Convierte grados a radianes
 */
export function degreesToRadians(degrees: number): number {
  return degrees * GEOMETRY_CONSTANTS.DEGREES_TO_RADIANS;
}

/**
 * Normaliza un ángulo al rango [0, 2π)
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % GEOMETRY_CONSTANTS.PI_2;
  if (normalized < 0) {
    normalized += GEOMETRY_CONSTANTS.PI_2;
  }
  return normalized;
}

/**
 * Normaliza un ángulo al rango [-π, π]
 */
export function normalizeAngleSigned(angle: number): number {
  let normalized = angle % GEOMETRY_CONSTANTS.PI_2;
  if (normalized > Math.PI) {
    normalized -= GEOMETRY_CONSTANTS.PI_2;
  } else if (normalized < -Math.PI) {
    normalized += GEOMETRY_CONSTANTS.PI_2;
  }
  return normalized;
}

/**
 * Calcula el ángulo más corto entre dos ángulos
 */
export function angleDifference(angle1: number, angle2: number): number {
  const diff = normalizeAngleSigned(angle2 - angle1);
  return Math.abs(diff) < GEOMETRY_ANGLE_EPSILON ? 0 : diff;
}

/**
 * Interpola entre dos ángulos por el camino más corto
 */
export function lerpAngle(angle1: number, angle2: number, t: number): number {
  const diff = angleDifference(angle1, angle2);
  return normalizeAngle(angle1 + diff * t);
}

/**
 * Verifica si dos ángulos son aproximadamente iguales
 */
export function anglesEqual(angle1: number, angle2: number, tolerance = GEOMETRY_ANGLE_EPSILON): boolean {
  return Math.abs(angleDifference(angle1, angle2)) < tolerance;
}

/**
 * Redondea un ángulo al múltiplo más cercano de un valor
 */
export function roundAngle(angle: number, snapAngle: number): number {
  if (snapAngle <= GEOMETRY_ANGLE_EPSILON) return angle;
  return Math.round(angle / snapAngle) * snapAngle;
}
