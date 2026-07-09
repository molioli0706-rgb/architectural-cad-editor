/**
 * ÍNDICE ESPACIAL QUADTREE
 *
 * Estructura de datos para búsquedas espaciales eficientes
 * Particularmente útil para encontrar objetos próximos rápidamente
 */

import type { Vector2D, Rectangle } from "./types";
import { GEOMETRY_EPSILON } from "./types";
import { boundsOverlap, pointInBounds, expandBounds } from "./polygon";

export interface SpatialObject<T> {
  readonly id: string;
  readonly bounds: Rectangle;
  readonly data: T;
}

interface QuadTreeNode<T> {
  bounds: Rectangle;
  objects: SpatialObject<T>[];
  children: QuadTreeNode<T>[] | null;
  depth: number;
}

const MAX_OBJECTS_PER_NODE = 4;
const MAX_DEPTH = 10;

/**
 * Estructura Quadtree para indexación espacial
 */
export class SpatialIndex<T> {
  private root: QuadTreeNode<T>;
  private allObjects: Map<string, SpatialObject<T>> = new Map();

  constructor(bounds: Rectangle) {
    this.root = {
      bounds,
      objects: [],
      children: null,
      depth: 0,
    };
  }

  /**
   * Añade un objeto al índice
   */
  insert(id: string, bounds: Rectangle, data: T): void {
    const obj: SpatialObject<T> = { id, bounds, data };
    this.allObjects.set(id, obj);
    this._insertNode(this.root, obj);
  }

  /**
   * Elimina un objeto del índice
   */
  remove(id: string): void {
    this.allObjects.delete(id);
    // Rebuild completo (simplificado para claridad)
    this.rebuild();
  }

  /**
   * Busca todos los objetos que se solapan con un rectángulo
   */
  query(bounds: Rectangle): SpatialObject<T>[] {
    const results: SpatialObject<T>[] = [];
    this._queryNode(this.root, bounds, results);
    return results;
  }

  /**
   * Busca objetos cercanos a un punto
   */
  queryNearest(point: Vector2D, maxDistance: number): SpatialObject<T>[] {
    const searchBounds = {
      minX: point.x - maxDistance,
      minY: point.y - maxDistance,
      maxX: point.x + maxDistance,
      maxY: point.y + maxDistance,
    };
    return this.query(searchBounds);
  }

  /**
   * Reconstruye el árbol (completo)
   */
  rebuild(): void {
    const objects = Array.from(this.allObjects.values());
    this.root.objects = [];
    this.root.children = null;
    for (const obj of objects) {
      this._insertNode(this.root, obj);
    }
  }

  /**
   * Inserta un objeto en el nodo
   */
  private _insertNode(node: QuadTreeNode<T>, obj: SpatialObject<T>): void {
    if (!boundsOverlap(node.bounds, obj.bounds)) {
      return;
    }

    if (node.children === null) {
      node.objects.push(obj);

      if (node.objects.length > MAX_OBJECTS_PER_NODE && node.depth < MAX_DEPTH) {
        this._subdivide(node);
      }
    } else {
      for (const child of node.children) {
        this._insertNode(child, obj);
      }
    }
  }

  /**
   * Subdivide un nodo en 4 cuadrantes
   */
  private _subdivide(node: QuadTreeNode<T>): void {
    const { minX, minY, maxX, maxY } = node.bounds;
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const quadrants: Rectangle[] = [
      { minX, minY, maxX: midX, maxY: midY },
      { minX: midX, minY, maxX, maxY: midY },
      { minX, minY: midY, maxX: midX, maxY },
      { minX: midX, minY: midY, maxX, maxY },
    ];

    node.children = quadrants.map((bounds) => ({
      bounds,
      objects: [],
      children: null,
      depth: node.depth + 1,
    }));

    const objectsToRedistribute = node.objects;
    node.objects = [];

    for (const obj of objectsToRedistribute) {
      for (const child of node.children) {
        this._insertNode(child, obj);
      }
    }
  }

  /**
   * Query recursiva en el árbol
   */
  private _queryNode(
    node: QuadTreeNode<T>,
    bounds: Rectangle,
    results: SpatialObject<T>[]
  ): void {
    if (!boundsOverlap(node.bounds, bounds)) {
      return;
    }

    for (const obj of node.objects) {
      if (boundsOverlap(obj.bounds, bounds)) {
        results.push(obj);
      }
    }

    if (node.children !== null) {
      for (const child of node.children) {
        this._queryNode(child, bounds, results);
      }
    }
  }
}
