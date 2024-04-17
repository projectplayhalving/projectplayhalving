export function truncateMiddle(str: string, maxLength: number = 12) {
  if (str.length <= maxLength) {
    return str;
  }

  var start = Math.ceil(maxLength / 2);
  var end = Math.floor(maxLength / 2);
  return str.slice(0, start) + " ... " + str.slice(-end);
}
export function splitArrayIntoChunks(array: any[], chunkSize: number) {
  let chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
