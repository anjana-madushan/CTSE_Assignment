// Define the TypeScript function with type annotations
function timeDuration(milliseconds: number): string {
  // Ensure the input is a positive number
  if (typeof milliseconds !== 'number' || milliseconds < 0) {
    throw new Error('Invalid input. Please provide a non-negative number of milliseconds.');
  }

  // Calculate the components of the duration
  const seconds: number = Math.floor(milliseconds / 1000) % 60;
  const minutes: number = Math.floor(milliseconds / (1000 * 60)) % 60;
  const hours: number = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
  const days: number = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) % 365;
  const years: number = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 365));

  // Create parts of the formatted string
  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years}y`);
  }
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0) {
    parts.push(`${seconds}s`);
  }

  // Join the parts into a readable string
  return parts.join(' ');
}

// Correct the export statement to export `timeDuration` as default
export default timeDuration;