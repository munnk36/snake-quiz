
export function getLargeImageUrl(squareUrl: string): string {
  return squareUrl.replace('square.', 'large.');
}

export function getMediumImageUrl(squareUrl: string): string {
  return squareUrl.replace('square.', 'medium.');
}