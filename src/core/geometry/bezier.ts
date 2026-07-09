/**
 * FUNCIONES DE SUAVIZADO Y APROXIMACIÓN
 *
 * Algoritmos para interpolar y suavizar curvas
 */

import type { Vector2D } from "./types";
import { magnitude, addVectors, scaleVector, subtractVectors } from "./vector";

/**
 * Catmull-Rom spline - Interpola suavemente entre puntos de control
 */
export function catmullRom(
  p0: Vector2D,
  p1: Vector2D,
  p2: Vector2D,
  p3: Vector2D,
  t: number
): Vector2D {
  const t2 = t * t;
  const t3 = t2 * t;

  const coeff0 = -0.5 * t3 + t2 - 0.5 * t;
  const coeff1 = 1.5 * t3 - 2.5 * t2 + 1;
  const coeff2 = -1.5 * t3 + 2 * t2 + 0.5 * t;
  const coeff3 = 0.5 * t3 - 0.5 * t2;

  return {
    x: coeff0 * p0.x + coeff1 * p1.x + coeff2 * p2.x + coeff3 * p3.x,
    y: coeff0 * p0.y + coeff1 * p1.y + coeff2 * p2.y + coeff3 * p3.y,
  };
}

/**
 * Bezier cúbica
 */
export function cubicBezier(
  p0: Vector2D,
  p1: Vector2D,
  p2: Vector2D,
  p3: Vector2D,
  t: number
): Vector2D {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  const coeff0 = mt3;
  const coeff1 = 3 * mt2 * t;
  const coeff2 = 3 * mt * t2;
  const coeff3 = t3;

  return {
    x: coeff0 * p0.x + coeff1 * p1.x + coeff2 * p2.x + coeff3 * p3.x,
    y: coeff0 * p0.y + coeff1 * p1.y + coeff2 * p2.y + coeff3 * p3.y,
  };
}

/**
 * Bezier cuadrática
 */
export function quadraticBezier(
  p0: Vector2D,
  p1: Vector2D,
  p2: Vector2D,
  t: number
): Vector2D {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;

  const coeff0 = mt2;
  const coeff1 = 2 * mt * t;
  const coeff2 = t2;

  return {
    x: coeff0 * p0.x + coeff1 * p1.x + coeff2 * p2.x,
    y: coeff0 * p0.y + coeff1 * p1.y + coeff2 * p2.y,
  };
}

/**
 * Suaviza una ruta de puntos usando Catmull-Rom
 */
export function smoothPath(points: Vector2D[], segments = 10): Vector2D[] {
  if (points.length < 2) return points;
  if (points.length === 2) {
    const smoothed: Vector2D[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      smoothed.push({
        x: points[0].x + (points[1].x - points[0].x) * t,
        y: points[0].y + (points[1].y - points[0].y) * t,
      });
    }
    return smoothed;
  }

  const smoothed: Vector2D[] = [points[0]];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i === points.length - 2 ? points[points.length - 1] : points[i + 2];

    for (let j = 1; j <= segments; j++) {
      const t = j / segments;
      smoothed.push(catmullRom(p0, p1, p2, p3, t));
    }
  }

  return smoothed;
}

/**
 * Reduce puntos en una ruta usando Ramer-Douglas-Peucker
 */
export function simplifyPath(
  points: Vector2D[],
  tolerance: number
): Vector2D[] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let maxIndex = 0;

  // Distancia del punto a la línea entre primer y último punto
  const line = subtractVectors(points[points.length - 1], points[0]);
  const lineMag = magnitude(line);

  for (let i = 1; i < points.length - 1; i++) {
    const toPoint = subtractVectors(points[i], points[0]);
    const cross = Math.abs(
      line.x * toPoint.y - line.y * toPoint.x
    );
    const dist = cross / lineMag;

    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }

  if (maxDist > tolerance) {
    const left = simplifyPath(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyPath(points.slice(maxIndex), tolerance);
    return left.slice(0, -1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
}
