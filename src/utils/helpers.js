import { formatDistance, parseISO } from 'date-fns';
import { differenceInDays } from 'date-fns/differenceInDays';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have
// changed, which isn't good. So we use this trick to remove any time.
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it not at 0.0.0.0, so we need to set the date
  // to be END of the day when we compare it with earlier dates.
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
    value
  );

export const getDifference = (a, b) => {
  const diff = {};

  // Get all keys from both objects
  const keys1 = Object.keys(a);
  const keys2 = Object.keys(b);

  // Find properties that exist in obj1 but not in obj2
  keys1.forEach((key) => {
    if (!(key in b)) {
      diff[key] = a[key];
    }
  });

  // Find properties that exist in obj2 but not in obj1, but only include the values from obj1
  keys2.forEach((key) => {
    if (!(key in a)) {
      // Only add if the key exists in a
      if (key in a) {
        diff[key] = a[key];
      }
    }
  });

  return diff;
};

export const getDifferenceReversed = (a, b) => {
  const result = {};

  // Get keys from obj1 and check if they exist in obj2
  Object.keys(a).forEach((key) => {
    if (key in b) {
      result[key] = a[key];  // Use values from obj1
    }
  });

  return result;
}

export const objsAreTheSame = (a, b) => {
  const keys1 = Object.keys(a);
  const keys2 = Object.keys(b);

  // If the number of keys is different, objects are not equal
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Compare values of each key in obj1 with obj2
  for (let key of keys1) {
    if (a[key] !== b[key]) {
      return false;  // Return false if any value differs
    }
  }

  return true;  // If all values match, return true
}