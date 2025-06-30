// Utility to get the first available date for a rover from the static JSON
import roverDates from './rover_dates.json';

export function getDefaultDateForRover(rover) {
  // For Opportunity and Spirit, use the last available date (latest image)
  if ((rover === 'opportunity' || rover === 'spirit') && roverDates[rover] && roverDates[rover].length > 0) {
    return roverDates[rover][roverDates[rover].length - 1];
  }
  // For curiosity, use previous day's date as default
  if (rover === 'curiosity') {
    const today = new Date();
    const prevDay = new Date(today);
    prevDay.setDate(today.getDate() - 1);
    return prevDay.toISOString().slice(0, 10);
  }
  // fallback to a safe date
  return '2015-06-03';
}

export function getValidDatesForRover(rover) {
  return roverDates[rover] || [];
}
