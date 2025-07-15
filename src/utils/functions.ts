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
