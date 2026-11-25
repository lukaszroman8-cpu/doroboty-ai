import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ErrorBoundary, ErrorFallback } from "./error-boundary";

describe("ErrorBoundary", () => {
  it("switches to the fallback after a render error", () => {
    expect(ErrorBoundary.getDerivedStateFromError()).toEqual({ failed: true });
  });

  it("renders children while nothing failed", () => {
    const html = renderToStaticMarkup(
      createElement(ErrorBoundary, null, createElement("p", null, "Treść widoku")),
    );
    expect(html).toBe("<p>Treść widoku</p>");
  });

  it("explains recovery without exposing error details", () => {
    const html = renderToStaticMarkup(createElement(ErrorFallback));
    expect(html).toContain('role="alert"');
    expect(html).toContain("Coś poszło nie tak");
    expect(html).toContain("Odśwież stronę");
    expect(html).toContain('href="#/app/settings"');
  });
});
