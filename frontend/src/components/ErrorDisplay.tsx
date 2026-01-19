interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay = ({ message }: ErrorDisplayProps) => (
  <p className="errorMessage">Error: {message}</p>
);