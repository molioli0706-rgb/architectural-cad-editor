import { describe, it, expect } from "vitest";
import { createPolygon, polygonArea, polygonPerimeter, polygonCentroid, pointInPolygon, polygonBounds } from "@core/geometry";

describe("Polygon Operations", () => {
  it("creates a polygon with vertices", () => {
    const vertices = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    const polygon = createPolygon(vertices);
    expect(polygon.vertices.length).toBe(4);
    expect(polygon.closed).toBe(true);
  });

  it("calculates polygon area correctly", () => {
    const vertices = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    const polygon = createPolygon(vertices);
    expect(polygonArea(polygon)).toBe(100);
  });

  it("calculates polygon perimeter correctly", () => {
    const vertices = [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 4 },
      { x: 0, y: 4 },
    ];
    const polygon = createPolygon(vertices);
    expect(polygonPerimeter(polygon)).toBe(14);
  });

  it("calculates polygon centroid", () => {
    const vertices = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    const polygon = createPolygon(vertices);
    const centroid = polygonCentroid(polygon);
    expect(centroid.x).toBe(5);
    expect(centroid.y).toBe(5);
  });

  it("detects point inside polygon", () => {
    const vertices = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    const polygon = createPolygon(vertices);
    expect(pointInPolygon({ x: 5, y: 5 }, polygon)).toBe(true);
    expect(pointInPolygon({ x: 15, y: 15 }, polygon)).toBe(false);
  });

  it("calculates polygon bounds", () => {
    const vertices = [
      { x: 2, y: 3 },
      { x: 12, y: 3 },
      { x: 12, y: 13 },
      { x: 2, y: 13 },
    ];
    const polygon = createPolygon(vertices);
    const bounds = polygonBounds(polygon);
    expect(bounds.minX).toBe(2);
    expect(bounds.maxX).toBe(12);
    expect(bounds.minY).toBe(3);
    expect(bounds.maxY).toBe(13);
  });
});
