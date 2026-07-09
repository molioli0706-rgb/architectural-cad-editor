/**
 * OPERACIONES CON CÍRCULOS
 *
 * Funciones para trabajar con círculos y arcos
 */

import type { Vector2D, Circle, Arc, LineSegment, IntersectionResult } from "./types";
import { GEOMETRY_EPSILON } from "./types";
import { distance, magnitude, subtractVectors, addVectors, scaleVector } from "./vector";
import { nearestPointOnSegment } from "./line";

/**
 * Crea un círculo
 */
export function createCircle(center: Vector2D, radius: number): Circle {
  return { center, radius };
}

/**
 * Calcula el perímetro de un círculo
 */
export function circlePerimeter(circle: Circle): number {
  return 2 * Math.PI * circle.radius;
}

/**
 * Calcula el área de un círculo
 */
export function circleArea(circle: Circle): number {
  return Math.PI * circle.radius * circle.radius;
}

/**
 * Verifica si un punto está dentro de un círculo
 */
export function pointInCircle(point: Vector2D, circle: Circle): boolean {
  return distance(point, circle.center) <= circle.radius + GEOMETRY_EPSILON;
}

/**
 * Verifica si un punto está en la circunferencia
 */
export function pointOnCircle(point: Vector2D, circle: Circle, tolerance = GEOMETRY_EPSILON): boolean {
  const d = distance(point, circle.center);
  return Math.abs(d - circle.radius) < tolerance;
}

/**
 * Calcula la distancia más corta desde un punto a un círculo
 */
export function distanceToCircle(point: Vector2D, circle: Circle): number {
  const d = distance(point, circle.center);
  return Math.max(0, d - circle.radius);
}

/**
 * Calcula el punto más cercano en un círculo a un punto dado
 */
export function nearestPointOnCircle(point: Vector2D, circle: Circle): Vector2D {
  const toPoint = subtractVectors(point, circle.center);
  const dist = magnitude(toPoint);

  if (dist < GEOMETRY_EPSILON) {
    return { x: circle.center.x + circle.radius, y: circle.center.y };
  }

  const normalized = scaleVector(toPoint, 1 / dist);
  return addVectors(circle.center, scaleVector(normalized, circle.radius));
}

/**
 * Verifica si dos círculos se solapan
 */
export function circlesOverlap(c1: Circle, c2: Circle): boolean {
  const d = distance(c1.center, c2.center);
  return d <= c1.radius + c2.radius + GEOMETRY_EPSILON;
}

/**
 * Verifica si dos círculos se tocan
 */
export function circlesTouching(c1: Circle, c2: Circle, tolerance = GEOMETRY_EPSILON): boolean {
  const d = distance(c1.center, c2.center);
  return Math.abs(d - (c1.radius + c2.radius)) < tolerance;
}

/**
 * Calcula la intersección entre un círculo y una línea
 */
export function circleLineSegmentIntersection(
  circle: Circle,
  segment: LineSegment
): IntersectionResult {
  const nearest = nearestPointOnSegment(segment, circle.center);

  if (nearest.distance > circle.radius + GEOMETRY_EPSILON) {
    return {
      intersects: false,
      points: [],
      tangent: false,
    };
  }

  if (Math.abs(nearest.distance - circle.radius) < GEOMETRY_EPSILON) {
    return {
      intersects: true,
      points: [
        {
          point: nearest.point,
          t1: nearest.parameter,
          t2: 0,
          onSegment1: nearest.onSegment,
          onSegment2: false,
        },
      ],
      tangent: true,
    };
  }

  // Calcula ambos puntos de intersección (si existen)
  const h = Math.sqrt(circle.radius * circle.radius - nearest.distance * nearest.distance);
  const direction = subtractVectors(segment.p2, segment.p1);
  const len = magnitude(direction);

  if (len < GEOMETRY_EPSILON) {
    return {
      intersects: false,
      points: [],
      tangent: false,
    };
  }

  const d = h / len;
  const t1 = nearest.parameter - d;
  const t2 = nearest.parameter + d;

  return {
    intersects: true,
    points: [
      {
        point: addVectors(segment.p1, scaleVector(direction, t1)),
        t1,
        t2: 0,
        onSegment1: t1 >= -GEOMETRY_EPSILON && t1 <= 1 + GEOMETRY_EPSILON,
        onSegment2: false,
      },
      {
        point: addVectors(segment.p1, scaleVector(direction, t2)),
        t1: t2,
        t2: 0,
        onSegment1: t2 >= -GEOMETRY_EPSILON && t2 <= 1 + GEOMETRY_EPSILON,
        onSegment2: false,
      },
    ],
    tangent: false,
  };
}
