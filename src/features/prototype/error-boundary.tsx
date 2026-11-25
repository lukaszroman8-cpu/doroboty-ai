import { Component, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";

// Shown instead of a blank page when a view throws while rendering.
// Uses plain hash links so it also works outside the router and the prototype store.
// Errors are intentionally not logged: views may hold private free text.
export function ErrorFallback() {
  return (
    <section className="prototype-section" role="alert">
      <h1>Coś poszło nie tak</h1>
      <p className="my-5">
        Tego widoku nie udało się wyświetlić. Dane zapisane w tej przeglądarce nie zostały usunięte.
        Odśwież stronę albo przejdź do ustawień, aby pobrać kopię danych lub zresetować scenariusz.
      </p>
      <div className="flex flex-wrap gap-[10px]">
        <button type="button" className={buttonVariants()} onClick={() => window.location.reload()}>
          Odśwież stronę
        </button>
        <a className={buttonVariants({ variant: "outline" })} href="#/app/settings">
          Przejdź do ustawień
        </a>
      </div>
    </section>
  );
}

interface ErrorBoundaryState {
  failed: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <ErrorFallback /> : this.props.children;
  }
}
