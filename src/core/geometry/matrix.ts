/**
 * OPERACIONES CON MATRICES
 *
 * Funciones para trabajar con matrices de transformación 3x3 para 2D
 */

import type { Vector2D, Matrix3x3, Transform2D } from "./types";
import { createVector, scaleVector } from "./vector";

/**
 * Crea una matriz identidad
 */
export function identityMatrix(): Matrix3x3 {
  return {
    m: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  };
}

/**
 * Crea una matriz de traslación
 */
export function translationMatrix(x: number, y: number): Matrix3x3 {
  return {
    m: [1, 0, x, 0, 1, y, 0, 0, 1],
  };
}

/**
 * Crea una matriz de escala
 */
export function scaleMatrix(sx: number, sy: number): Matrix3x3 {
  return {
    m: [sx, 0, 0, 0, sy, 0, 0, 0, 1],
  };
}

/**
 * Crea una matriz de rotación (en radianes)
 */
export function rotationMatrix(angle: number): Matrix3x3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    m: [cos, -sin, 0, sin, cos, 0, 0, 0, 1],
  };
}

/**
 * Multiplica dos matrices
 */
export function multiplyMatrices(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
  const am = a.m;
  const bm = b.m;
  const result: number[] = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) {
        sum += am[i * 3 + k] * bm[k * 3 + j];
      }
      result.push(sum);
    }
  }

  return { m: result as readonly number[] };
}

/**
 * Aplica una matriz a un vector
 */
export function applyMatrix(matrix: Matrix3x3, vector: Vector2D): Vector2D {
  const m = matrix.m;
  return {
    x: m[0] * vector.x + m[1] * vector.y + m[2],
    y: m[3] * vector.x + m[4] * vector.y + m[5],
  };
}

/**
 * Invierte una matriz
 */
export function invertMatrix(matrix: Matrix3x3): Matrix3x3 {
  const m = matrix.m;
  const det = m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);

  if (Math.abs(det) < 1e-10) {
    throw new Error("Matrix is not invertible");
  }

  const invDet = 1 / det;
  return {
    m: [
      (m[4] * m[8] - m[5] * m[7]) * invDet,
      (m[2] * m[7] - m[1] * m[8]) * invDet,
      (m[1] * m[5] - m[2] * m[4]) * invDet,
      (m[5] * m[6] - m[3] * m[8]) * invDet,
      (m[0] * m[8] - m[2] * m[6]) * invDet,
      (m[2] * m[3] - m[0] * m[5]) * invDet,
      (m[3] * m[7] - m[4] * m[6]) * invDet,
      (m[1] * m[6] - m[0] * m[7]) * invDet,
      (m[0] * m[4] - m[1] * m[3]) * invDet,
    ] as readonly number[],
  };
}

/**
 * Convierte una transformación 2D a matriz
 */
export function transformToMatrix(transform: Transform2D): Matrix3x3 {
  // Orden: traducción, rotación, escala
  let matrix = translationMatrix(transform.translate.x, transform.translate.y);
  matrix = multiplyMatrices(matrix, rotationMatrix(transform.rotation));
  matrix = multiplyMatrices(matrix, scaleMatrix(transform.scale.x, transform.scale.y));
  return matrix;
}
