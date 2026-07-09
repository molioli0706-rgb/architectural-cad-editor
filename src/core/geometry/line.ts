/**
 * OPERACIONES CON LÍNEAS
 *
 * Funciones para trabajar con líneas, segmentos y cálculos de intersección.
 * Todas devuelven nuevos objetos (inmutabilidad).
 */

import type {
  Vector2D,
  Line,
  LineSegment,
  InfiniteLine,
  IntersectionPoint,
  IntersectionResult,
  NearestPointResult,
  PointLinePosition,
} from "./types";
import { GEOMETRY_EPSILON, PointLinePosition, LineIntersectionType } from "./types";
import {
  createVector,
  addVectors,
  subtractVectors,
  scaleVector,
  dotProduct,
  crossProduct,
  magnitude,
  distance,
  normalize,
  angleBetween,
} from "./vector";

/**
 * Crea una línea finita entre dos puntos
 */
export function createLine(start: Vector2D, end: Vector2D): Line {
  return { start, end };
}

/**
 * Crea un segmento de línea
 */
export function createLineSegment(p1: Vector2D, p2: Vector2D): LineSegment {
  return { p1, p2 };
}

/**
 * Crea una línea infinita a partir de un punto y una dirección
 */
export function createInfiniteLine(point: Vector2D, direction: Vector2D): InfiniteLine {
  return {
    point,
    direction: normalize(direction),
  };
}

/**
 * Crea una línea infinita a partir de dos puntos
 */
export function infiniteLineFromPoints(p1: Vector2D, p2: Vector2D): InfiniteLine {
  return createInfiniteLine(p1, subtractVectors(p2, p1));
}

/**
 * Calcula la longitud de una línea finita
 */
export function lineLength(line: Line): number {
  return distance(line.start, line.end);
}

/**
 * Calcula la longitud de un segmento
 */
export function segmentLength(segment: LineSegment): number {
  return distance(segment.p1, segment.p2);
}

/**
 * Obtiene el punto en una línea a parámetro t (0=start, 1=end)
 */
export function getPointOnLine(line: Line, t: number): Vector2D {
  return addVectors(line.start, scaleVector(subtractVectors(line.end, line.start), t));
}

/**
 * Obtiene el punto en un segmento a parámetro t
 */
export function getPointOnSegment(segment: LineSegment, t: number): Vector2D {
  return addVectors(segment.p1, scaleVector(subtractVectors(segment.p2, segment.p1), t));
}

/**
 * Obtiene el punto en una línea infinita a parámetro t
 */
export function getPointOnInfiniteLine(line: InfiniteLine, t: number): Vector2D {
  return addVectors(line.point, scaleVector(line.direction, t));
}

/**
 * Calcula el punto más cercano de un segmento a un punto dado
 */
export function nearestPointOnSegment(segment: LineSegment, point: Vector2D): NearestPointResult {
  const dx = segment.p2.x - segment.p1.x;
  const dy = segment.p2.y - segment.p1.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq < GEOMETRY_EPSILON * GEOMETRY_EPSILON) {
    return {
      point: segment.p1,
      distance: distance(segment.p1, point),
      parameter: 0,
      onSegment: true,
    };
  }

  const px = point.x - segment.p1.x;
  const py = point.y - segment.p1.y;
  let t = (px * dx + py * dy) / lengthSq;

  const onSegment = t >= 0 && t <= 1;
  t = Math.max(0, Math.min(1, t));

  const nearest = getPointOnSegment(segment, t);
  return {
    point: nearest,
    distance: distance(nearest, point),
    parameter: t,
    onSegment,
  };
}

/**
 * Calcula el punto más cercano de una línea infinita a un punto
 */
export function nearestPointOnInfiniteLine(
  line: InfiniteLine,
  point: Vector2D
): NearestPointResult {
  const v = subtractVectors(point, line.point);
  const t = dotProduct(v, line.direction);
  const nearest = addVectors(line.point, scaleVector(line.direction, t));

  return {
    point: nearest,
    distance: distance(nearest, point),
    parameter: t,
    onSegment: false,
  };
}

/**
 * Determina la posición de un punto relativo a una línea
 */
export function pointLinePosition(line: InfiniteLine, point: Vector2D): PointLinePosition {
  const v = subtractVectors(point, line.point);
  const cross = crossProduct(line.direction, v);

  if (Math.abs(cross) < GEOMETRY_EPSILON) {
    return PointLinePosition.ON_LINE;
  }
  return cross > 0 ? PointLinePosition.LEFT : PointLinePosition.RIGHT;
}

/**
 * Calcula la intersección entre dos líneas infinitas
 */
export function infiniteLinesIntersection(
  line1: InfiniteLine,
  line2: InfiniteLine
): IntersectionResult {
  const d1 = line1.direction;
  const d2 = line2.direction;
  const diff = subtractVectors(line2.point, line1.point);

  const cross = crossProduct(d1, d2);

  if (Math.abs(cross) < GEOMETRY_EPSILON) {
    // Líneas paralelas o colineales
    if (Math.abs(crossProduct(diff, d1)) < GEOMETRY_EPSILON) {
      // Colineales
      return {
        intersects: true,
        points: [],
        tangent: false,
      };
    }
    // Paralelas
    return {
      intersects: false,
      points: [],
      tangent: false,
    };
  }

  // Líneas se intersectan en un punto
  const t1 = crossProduct(diff, d2) / cross;
  const intersection = getPointOnInfiniteLine(line1, t1);

  return {
    intersects: true,
    points: [
      {
        point: intersection,
        t1,
        t2: crossProduct(diff, d1) / cross,
        onSegment1: false,
        onSegment2: false,
      },
    ],
    tangent: false,
  };
}

/**
 * Calcula la intersección entre dos segmentos
 */
export function segmentsIntersection(
  seg1: LineSegment,
  seg2: LineSegment
): IntersectionResult {
  const line1 = infiniteLineFromPoints(seg1.p1, seg1.p2);
  const line2 = infiniteLineFromPoints(seg2.p1, seg2.p2);

  const result = infiniteLinesIntersection(line1, line2);

  if (!result.intersects || result.points.length === 0) {
    return result;
  }

  const intersection = result.points[0];
  const onSegment1 = intersection.t1 >= -GEOMETRY_EPSILON && intersection.t1 <= 1 + GEOMETRY_EPSILON;
  const onSegment2 = intersection.t2 >= -GEOMETRY_EPSILON && intersection.t2 <= 1 + GEOMETRY_EPSILON;

  if (!onSegment1 || !onSegment2) {
    return {
      intersects: false,
      points: [],
      tangent: false,
    };
  }

  return {
    intersects: true,
    points: [
      {
        ...intersection,
        onSegment1,
        onSegment2,
      },
    ],
    tangent: false,
  };
}

/**
 * Calcula la intersección entre un segmento y una línea infinita
 */
export function segmentInfiniteLineIntersection(
  segment: LineSegment,
  line: InfiniteLine
): IntersectionResult {
  const segLine = infiniteLineFromPoints(segment.p1, segment.p2);
  const result = infiniteLinesIntersection(segLine, line);

  if (!result.intersects || result.points.length === 0) {
    return result;
  }

  const intersection = result.points[0];
  const onSegment = intersection.t1 >= -GEOMETRY_EPSILON && intersection.t1 <= 1 + GEOMETRY_EPSILON;

  if (!onSegment) {
    return {
      intersects: false,
      points: [],
      tangent: false,
    };
  }

  return {
    intersects: true,
    points: [
      {
        ...intersection,
        onSegment1: true,
        onSegment2: false,
      },
    ],
    tangent: false,
  };
}

/**
 * Calcula la distancia más corta entre dos segmentos
 */
export function distanceBetweenSegments(seg1: LineSegment, seg2: LineSegment): number {
  const nearest1 = nearestPointOnSegment(seg1, seg2.p1);
  const nearest2 = nearestPointOnSegment(seg1, seg2.p2);
  const nearest3 = nearestPointOnSegment(seg2, seg1.p1);
  const nearest4 = nearestPointOnSegment(seg2, seg1.p2);

  return Math.min(nearest1.distance, nearest2.distance, nearest3.distance, nearest4.distance);
}

/**
 * Extrae un sub-segmento de un segmento usando parámetros t1 y t2
 */
export function subSegment(segment: LineSegment, t1: number, t2: number): LineSegment {
  return {
    p1: getPointOnSegment(segment, t1),
    p2: getPointOnSegment(segment, t2),
  };
}

/**
 * Verifica si un punto está en un segmento
 */
export function pointOnSegment(point: Vector2D, segment: LineSegment, tolerance = GEOMETRY_EPSILON): boolean {
  const nearest = nearestPointOnSegment(segment, point);
  return nearest.onSegment && nearest.distance < tolerance;
}

/**
 * Obtiene la perpendicular desde un punto a una línea infinita
 */
export function perpendicularFromPoint(point: Vector2D, line: InfiniteLine): Line {
  const nearest = nearestPointOnInfiniteLine(line, point);
  return {
    start: point,
    end: nearest.point,
  };
}

/**
 * Crea una línea paralela a otra, desplazada por una distancia
 */
export function parallelLine(line: InfiniteLine, distance: number): InfiniteLine {
  const perpDir = createVector(-line.direction.y, line.direction.x);
  const offset = scaleVector(perpDir, distance);
  return {
    point: addVectors(line.point, offset),
    direction: line.direction,
  };
}

/**
 * Calcula el ángulo de una línea (en radianes)
 */
export function lineAngle(line: Line): number {
  const dir = subtractVectors(line.end, line.start);
  return Math.atan2(dir.y, dir.x);
}
