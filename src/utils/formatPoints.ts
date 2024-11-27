export function formatPoints(points: { x: number; y: number }[], template: string): string {
  return points
    .map((point, index) => {
      let formatted = template;
      formatted = formatted.replace(/\{i\}/g, (index + 1).toString());
      formatted = formatted.replace(/\{x\}/g, point.x.toString());
      formatted = formatted.replace(/\{y\}/g, point.y.toString());
      return formatted;
    })
    .join('');
}