/* Strict parsing for copy-pasted rider timeline rows; never invent events. */
function normalizeClock(hourRaw, minuteRaw, periodRaw) {
  if (!/^\d{1,2}$/.test(String(hourRaw)) || !/^\d{2}$/.test(String(minuteRaw)) ||
      !/^(AM|PM)$/i.test(String(periodRaw))) return null;
  const hour = Number(hourRaw), minute = Number(minuteRaw);
  const period = String(periodRaw).toUpperCase();
  if (!Number.isInteger(hour) || hour < 1 || hour > 12 ||
      !Number.isInteger(minute) || minute < 0 || minute > 59) return null;
  return hour + ':' + String(minute).padStart(2, '0') + ' ' + period;
}

function parseMainTimeline(text) {
  if (!text.trim()) return { parsedData: [] };
  const parsedData = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)\s+(.+)$/i.exec(trimmed);
    if (!match) throw new Error('Invalid main timeline row: ' + trimmed.slice(0, 80));
    const time = normalizeClock(match[1], match[2], match[3]);
    const event = match[4].trim().replace(/^\*{1,2}/, '').replace(/\*{1,2}$/, '').trim();
    if (!time || !event) throw new Error('Invalid main timeline event: ' + trimmed.slice(0, 80));
    parsedData.push({ time, event });
  }
  return { parsedData };
}

function parseAdditionalTimeline(text) {
  if (!text.trim()) return [];
  const parsedData = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = /^(.+?)\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(trimmed);
    if (!match) throw new Error('Invalid additional timeline row: ' + trimmed.slice(0, 80));
    const time = normalizeClock(match[2], match[3], match[4]);
    const event = match[1].trim();
    if (!time || !event) throw new Error('Invalid additional event: ' + trimmed.slice(0, 80));
    parsedData.push({ event, time });
  }
  return parsedData;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseMainTimeline, parseAdditionalTimeline, normalizeClock };
}
