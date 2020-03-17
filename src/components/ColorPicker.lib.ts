import * as colorsys from 'colorsys'
import * as _ from 'lodash'

export function hsv2rgb(hsv) {
  return colorsys.hex2Rgb(colorsys.hsv2Hex(hsv))
}

export function createHsvCanvas(
  hue: number,
  size: number,
  opt: { s?: 1 | -1; v?: 1 | -1 } = {},
) {
  const canvas_bit  = document.createElement('CANVAS') as HTMLCanvasElement
  canvas_bit.width  = size
  canvas_bit.height = size
  const canvas_bit_context = canvas_bit.getContext('2d')!
  const bitmap = canvas_bit_context.createImageData(size, size)
  for (const x of _.range(size)) {
    for (const y of _.range(size)) {
      const offset = 4 * (y * size + x)
      const rgb = hsv2rgb({
        h: hue,
        s: ((opt.s == -1 ? size - x - 1 : x) / size) * 100,
        v: ((opt.v == -1 ? size - y - 1 : y) / size) * 100,
      })
      bitmap.data[offset + 0] = rgb.r
      bitmap.data[offset + 1] = rgb.g
      bitmap.data[offset + 2] = rgb.b
      bitmap.data[offset + 3] = 255 // no transparency
    }
  }
  canvas_bit_context.putImageData(bitmap, 0, 0)
  return canvas_bit
}
