const intlDateTimeFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  calendar: "persian",
});

export function formatTimestamp(timestamp: number): string {
  const utcDate = new Date(timestamp * 1_000);

  return intlDateTimeFormatter.format(utcDate);
}
