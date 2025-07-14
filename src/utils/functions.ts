export function debounce(fn: () => void, delay = 50) {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

export function getRandomCommaSeparatedString(arr: string[]) {
  const count = Math.floor(Math.random() * 4) + 2; // random number between 2 and 5
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  return selected.join(",");
}
