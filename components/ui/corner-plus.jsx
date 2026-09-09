'use client'

// Decorative corner crosshairs from the old editorial (gridline) theme.
// The light glass redesign drops them; returning null keeps every
// existing <CornerPlus /> call site valid.
export default function CornerPlus() {
  return null
}
