import { describe, it, expect } from "vitest";
import {
  createCircle,
  circleArea,
  circlePerimeter,
  pointInCircle,
  pointOnCircle,
  nearestPointOnCircle,
  circlesTouching,
} from "@core/geometry";

describe("Circle Operations", () => {
  it("creates a circle with center and radius", () => {
    const circle = createCircle({ x: 5, y: 5 }, 10);
    expect(circle.center.x).toBe(5);
    expect(circle.radius).toBe(10);
  });

  it("calculates circle area correctly", () => {
    const circle = createCircle({ x: 0, y: 0 }, 5);
    expect(Math.abs(circleArea(circle) - Math.PI * 25)).toBeLessThan(0.01);
  });

  it("calculates circle perimeter correctly", () => {
    const circle = createCircle({ x: 0, y: 0 }, 5);
    expect(Math.abs(circlePerimeter(circle) - Math.PI * 10)).toBeLessThan(0.01);
  });

  it("detects point inside circle", () => {
    const circle = createCircle({ x: 0, y: 0 }, 10);
    expect(pointInCircle({ x: 0, y: 0 }, circle)).toBe(true);
    expect(pointInCircle({ x: 5, y: 0 }, circle)).toBe(true);
    expect(pointInCircle({ x: 15, y: 0 }, circle)).toBe(false);
  });

  it("detects point on circle circumference", () => {
    const circle = createCircle({ x: 0, y: 0 }, 5);
    expect(pointOnCircle({ x: 5, y: 0 }, circle)).toBe(true);
    expect(pointOnCircle({ x: 0, y: 5 }, circle)).toBe(true);
  });

  it("finds nearest point on circle", () => {
    const circle = createCircle({ x: 0, y: 0 }, 10);
    const point = { x: 20, y: 0 };
    const nearest = nearestPointOnCircle(point, circle);
    expect(nearest.x).toBe(10);
    expect(nearest.y).toBe(0);
  });

  it("detects touching circles", () => {
    const c1 = createCircle({ x: 0, y: 0 }, 5);
    const c2 = createCircle({ x: 10, y: 0 }, 5);
    expect(circlesTouching(c1, c2)).toBe(true);
  });
});
