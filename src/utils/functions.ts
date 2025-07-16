export function debounce(fn: () => void, delay = 50) {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

export function getRandomCommaSeparatedString(arr: string[], max: number, min: number) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  return selected.join(",");
}

export function getRandomTimeframe() {
  const minMinutes = 10;
  const maxMinutes = 12 * 60 + 15;

  const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  const hours = Math.floor(randomMinutes / 60);
  const minutes = randomMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}