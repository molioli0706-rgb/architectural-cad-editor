/**
 * CORE GEOMETRY TYPES
 * Define todas las estructuras de datos geométricas fundamentales
 * para toda la aplicación CAD.
 *
 * Principios:
 * - Inmutabilidad: Los datos nunca se modifican in-place
 * - Precisión: Uso de números de punto flotante con precisión 64-bit
 * - Consistencia: Unidades siempre en milímetros
 */

/**
 * Vector 2D - Representa un punto o vector en el espacio 2D
 * Unidades: milímetros
 */
export interface Vector2D {
  readonly x: number;
  readonly y: number;
}

/**
 * Matriz 3x3 - Para transformaciones 2D (incluye traducción)
 * Almacenada en row-major order
 */
export interface Matrix3x3 {
  readonly m: readonly number[]; // 9 elementos [m00, m01, m02, m10, m11, m12, m20, m21, m22]
}

/**
 * Rectángulo (bounding box) - Definido por esquina mín y máx
 */
export interface Rectangle {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

/**
 * Línea definida por dos puntos
 */
export interface Line {
  readonly start: Vector2D;
  readonly end: Vector2D;
}

/**
 * Línea infinita definida por un punto y una dirección normalizada
 */
export interface InfiniteLine {
  readonly point: Vector2D;
  readonly direction: Vector2D; // Normalizado
}

/**
 * Segmento de línea para cálculos de intersección
 */
export interface LineSegment {
  readonly p1: Vector2D;
  readonly p2: Vector2D;
}

/**
 * Polígono - Secuencia de vértices en orden
 */
export interface Polygon {
  readonly vertices: readonly Vector2D[];
  readonly closed: boolean;
}

/**
 * Círculo
 */
export interface Circle {
  readonly center: Vector2D;
  readonly radius: number; // mm
}

/**
 * Arco de círculo
 */
export interface Arc {
  readonly center: Vector2D;
  readonly radius: number;
  readonly startAngle: number; // radianes [0, 2π]
  readonly endAngle: number; // radianes
  readonly clockwise: boolean;
}

/**
 * Punto de intersección con metadatos
 */
export interface IntersectionPoint {
  readonly point: Vector2D;
  readonly t1: number; // Parámetro en primera línea [0, 1]
  readonly t2: number; // Parámetro en segunda línea [0, 1]
  readonly onSegment1: boolean;
  readonly onSegment2: boolean;
}

/**
 * Resultado de intersección entre dos elementos
 */
export interface IntersectionResult {
  readonly intersects: boolean;
  readonly points: readonly IntersectionPoint[];
  readonly tangent: boolean;
}

/**
 * Punto con información de proximidad
 */
export interface NearestPointResult {
  readonly point: Vector2D;
  readonly distance: number;
  readonly parameter: number; // 0-1 para segmentos, puede ser > 1 para líneas
  readonly onSegment: boolean;
}

/**
 * Cuadrilátero (4 vértices)
 * Usado para muros y elementos rectangulares
 */
export interface Quad {
  readonly v1: Vector2D;
  readonly v2: Vector2D;
  readonly v3: Vector2D;
  readonly v4: Vector2D;
}

/**
 * Transformación afín 2D
 * Almacena escala, rotación y traslación
 */
export interface Transform2D {
  readonly translate: Vector2D;
  readonly scale: Vector2D;
  readonly rotation: number; // radianes
}

/**
 * Rango paramétrico [min, max]
 */
export interface ParameterRange {
  readonly min: number;
  readonly max: number;
}

/**
 * Información sobre la curva más cercana
 */
export interface CurveNearestPoint {
  readonly point: Vector2D;
  readonly distance: number;
  readonly parameter: number;
}

/**
 * Resultado de subcurva extraída
 */
export interface SubCurve {
  readonly curve: LineSegment | Arc;
  readonly tStart: number;
  readonly tEnd: number;
}

/**
 * Convexidad de un polígono
 */
export enum Convexity {
  CONVEX = "convex",
  CONCAVE = "concave",
  COMPLEX = "complex", // Auto-intersectante
}

/**
 * Orientación de polígono
 */
export enum PolygonOrientation {
  CLOCKWISE = "clockwise",
  COUNTER_CLOCKWISE = "counter_clockwise",
  COLLINEAR = "collinear",
}

/**
 * Posición relativa de un punto respecto a una línea
 */
export enum PointLinePosition {
  ON_LINE = "on_line",
  LEFT = "left",
  RIGHT = "right",
}

/**
 * Tipos de intersección entre líneas
 */
export enum LineIntersectionType {
  NO_INTERSECTION = "no_intersection",
  POINT_INTERSECTION = "point_intersection",
  SEGMENT_OVERLAP = "segment_overlap",
  PARALLEL = "parallel",
  COLLINEAR = "collinear",
}

/**
 * Métrica de distancia usado en búsquedas espaciales
 */
export enum DistanceMetric {
  EUCLIDEAN = "euclidean",
  MANHATTAN = "manhattan",
  CHEBYSHEV = "chebyshev",
}

/**
 * Precisión de cálculos geométricos (mm)
 */
export const GEOMETRY_EPSILON = 1e-6; // 0.001 micras
export const GEOMETRY_ANGLE_EPSILON = 1e-8; // radianes

/**
 * Tolerancias de snap
 */
export interface SnapTolerance {
  readonly endpoint: number; // mm
  readonly midpoint: number;
  readonly intersection: number;
  readonly grid: number;
  readonly angle: number; // radianes (para magnetismo angular)
}

/**
 * Configuración geométrica predeterminada
 */
export const DEFAULT_SNAP_TOLERANCE: SnapTolerance = {
  endpoint: 10,
  midpoint: 10,
  intersection: 10,
  grid: 5,
  angle: Math.PI / 180, // 1 grado
};

/**
 * Constantes geométricas
 */
export const GEOMETRY_CONSTANTS = {
  PI_2: Math.PI * 2,
  PI_HALF: Math.PI / 2,
  DEGREES_TO_RADIANS: Math.PI / 180,
  RADIANS_TO_DEGREES: 180 / Math.PI,
  SQRT_2: Math.sqrt(2),
};
