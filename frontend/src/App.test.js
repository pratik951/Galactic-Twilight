import { render, screen } from '@testing-library/react';
import App from './App';

test('renders NASA Astronomy Picture of the Day', () => {
  render(<App />);
  expect(screen.getByText(/NASA Astronomy Picture of the Day/i)).toBeInTheDocument();
});

test('renders navigation buttons', () => {
  render(<App />);
  expect(screen.getByText(/APOD/i)).toBeInTheDocument();
  expect(screen.getByText(/Mars/i)).toBeInTheDocument();
  expect(screen.getByText(/EPIC/i)).toBeInTheDocument();
  expect(screen.getByText(/NEO/i)).toBeInTheDocument();
  expect(screen.getByText(/Solar/i)).toBeInTheDocument();
  expect(screen.getByText(/Asteroid Defense/i)).toBeInTheDocument();
});
