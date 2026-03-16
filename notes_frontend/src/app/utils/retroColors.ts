const retroPalette = [
  "#F6BE00", // yellow
  "#0066B3", // blue
  "#FF800E", // orange
  "#AB3A5A", // red
  "#0084D1", // teal
  "#F99379", // peach
  "#604E97", // purple
  "#F6B1A2", // pink
  "#B3446C", // burgundy
  "#DCD300", // olive
];

export function colorForTag(tag: string): string {
  // Simple hash based color selection
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return retroPalette[Math.abs(hash) % retroPalette.length];
}
