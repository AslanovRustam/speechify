import { useState, useEffect } from "react";

export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement,
): boolean {
  const bounds = element.getBoundingClientRect();
  const { x, y } = coordinate;

  return (
    x >= bounds.left &&
    x <= bounds.right &&
    y >= bounds.top &&
    y <= bounds.bottom
  );
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const computedStyle = window.getComputedStyle(element);
  const lineHeight = computedStyle.lineHeight;

  // If lineHeight is in 'px', just parse it, otherwise calculate it
  if (lineHeight.endsWith("px")) {
    return parseFloat(lineHeight);
  } else {
    // A fallback method to calculate line-height if it's set to 'normal' or a unitless number
    const fontSize = parseFloat(computedStyle.fontSize);
    return fontSize * 1.2; // assuming normal line-height is 1.2 times font-size
  }
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */

export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[],
): HoveredElementInfo | null {
  const [hoveredElementInfo, setHoveredElementInfo] =
    useState<HoveredElementInfo | null>(null);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const { clientX, clientY } = event;
      let foundElement: HTMLElement | null = null;

      for (const elem of parsedElements) {
        if (isPointInsideElement({ x: clientX, y: clientY }, elem)) {
          foundElement = elem;
          break;
        }
      }

      if (foundElement) {
        const bounds = getElementBounds(foundElement);
        const heightOfFirstLine = getLineHeightOfFirstLine(foundElement);

        setHoveredElementInfo({
          element: foundElement,
          top: bounds.top,
          left: bounds.left,
          heightOfFirstLine,
        });
      } else {
        setHoveredElementInfo(null);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [parsedElements]);

  return hoveredElementInfo;
}
