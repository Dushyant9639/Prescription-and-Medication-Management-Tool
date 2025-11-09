import { format, formatDistance, isToday, isTomorrow, isPast, addDays } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'h:mm a');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today at ${formatTime(dateObj)}`;
  }
  
  if (isTomorrow(dateObj)) {
    return `Tomorrow at ${formatTime(dateObj)}`;
  }
  
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

export const isExpiringSoon = (date, daysThreshold = 7) => {
  if (!date) return false;
  const expiryDate = new Date(date);
  const threshold = addDays(new Date(), daysThreshold);
  return expiryDate <= threshold && !isPast(expiryDate);
};

export const isExpired = (date) => {
  if (!date) return false;
  return isPast(new Date(date));
};

export const getDayOfWeek = (date) => {
  return format(new Date(date), 'EEEE');
};

export const getTimeFromString = (timeString) => {
  // Convert "09:00" to Date object for today
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date;
};
