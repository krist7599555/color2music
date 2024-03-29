<template>
  <div class="flex h-screen" :style="{ 'background-color': colorHEX }">
    <div
      class="m-auto px-6 py-5 rounded shadow bg-white"
      style="min-width: 200px"
    >
      <!-- <div>{{disabled_sv_input}}</div> -->
      <canvas ref="canvas" class="rounded"></canvas>
      <br />
      <div class="flex items-baseline">
        <div class="flex-1">
          <div class="font-bold mr-3">H</div>
          <input
            ref="colorH"
            type="number"
            :value="colorHSV.h"
            min="0"
            max="359"
            class="px-3 py-2 w-full rounded shadow outline-none"
          />
        </div>
        <div class="flex-1 m-3">
          <div class="font-bold mr-3">S</div>
          <input
            ref="colorS"
            type="number"
            :value="colorHSV.s"
            min="0"
            max="100"
            :class="disabled_sv_input ? 'bg-gray-300 opacity-50' : ''"
            class="px-3 py-2 w-full rounded shadow outline-none"
          />
        </div>
        <div class="flex-1">
          <div class="font-bold mr-3">V</div>
          <input
            ref="colorV"
            type="number"
            :value="colorHSV.v"
            min="0"
            max="100"
            :class="disabled_sv_input ? 'bg-gray-300 opacity-50' : ''"
            class="px-3 py-2 w-full rounded shadow outline-none"
          />
        </div>
      </div>
      <!-- <br />
      <div>
        <ul>
          <li v-for='log in info.logs' :key='log.id'>
            {{log}}
          </li>
        </ul>

      </div> -->
      <br />
      <div class="text-center">
        <div>{{ colorHSV }}</div>
        <div>{{ colorRGB }}</div>
        <div>{{ colorHEX }}</div>
      </div>
      <br />
      <button
        class="shadow px-2 py-1 rounded outline-none"
        @click="fullscreen()"
      >
        full screen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fromEvent, merge, map, scan, startWith } from "rxjs";
import { ref, onMounted, reactive } from "vue";
import _ from "lodash";
import * as colorsys from "colorsys";
import $ from "jquery";
import { createHsvCanvas } from "./ColorPicker.lib";

const canvas = ref<HTMLCanvasElement>();

const colorH = ref<HTMLInputElement>();
const colorS = ref<HTMLInputElement>();
const colorV = ref<HTMLInputElement>();

const colorHSV = reactive({
  h: _.random(360),
  s: _.random(40, 100),
  v: _.random(40, 100),
});
const colorHEX = ref<string>();
const colorRGB = reactive({ r: 0, g: 0, b: 0 });

const disabled_sv_input = ref(false);

onMounted(() => {
  console.log("MOUNTED");
  // color input element
  const els = {
    h: colorH.value!,
    s: colorS.value!,
    v: colorV.value!,
  };

  // listen to color input element
  const hsv_inputs = _.map(els, (el, field) =>
    fromEvent(el, "input").pipe(
      map((e) => (e.target as HTMLInputElement).value),
      map((val: string) => ({ [field]: +val }))
    )
  );

  // calculate color input to 3 format [hsv, hex, rgb]
  const renderHSV$ = merge(...hsv_inputs).pipe(
    startWith(colorHSV),
    scan(_.assign, {})
  );
  const renderHEX$ = renderHSV$.pipe(map(colorsys.hsv2Hex));
  const renderRGB$ = renderHEX$.pipe(map(colorsys.hex2Rgb));

  // assign calculated value back to vue template
  renderHSV$.subscribe((hsv) => _.assign(colorHSV, hsv));
  renderHEX$.subscribe((hex) => _.assign(colorHEX, { value: hex }));
  renderRGB$.subscribe((rgb) => _.assign(colorRGB, rgb));

  // canvas
  const reverse_v = true;
  const canvas_el: HTMLCanvasElement = canvas.value!;
  const canvas_size = _.max([canvas_el.height, canvas_el.width])!;

  // if click on canvas ~> update HSV.s & HSV.v
  $(canvas_el).on("pointerdown", (e) => {
    disabled_sv_input.value = true;
    const x = e.offsetX!;
    const y = e.offsetY!;
    const s = _.clamp(_.round((x / canvas_size) * 101), 0, 100);
    let v = _.clamp(_.round((y / canvas_size) * 101), 0, 100);
    if (reverse_v) v = 99 - v;
    els.s.value = _.toString(s);
    els.v.value = _.toString(v);
    els.s.dispatchEvent(new Event("input"));
    els.v.dispatchEvent(new Event("input"));
  });

  // if move on canvas ~> update HSV.h
  merge(
    fromEvent(canvas_el, "touchmove"),
    fromEvent(canvas_el, "mousemove")
  ).subscribe(() => {
    // $(canvas_el).on("pointermove", () => {

    if (disabled_sv_input.value) {
      els.h.value = _.toString((colorHSV.h + 1) % 360);
      els.h.dispatchEvent(new Event("input"));
    }
  });

  // if not hover ~> reset state
  $(canvas_el).on("pointerup", () => {
    disabled_sv_input.value = false;
  });

  // rerender canvas if HSV.h is change
  renderHSV$.pipe(map((e) => e.h)).subscribe((h) => {
    const canvas_ctx = canvas_el.getContext("2d")!;
    canvas_el.width = canvas_size;
    canvas_el.height = canvas_size;
    const bitmap_size = 6;
    const canvas_bit = createHsvCanvas(
      h,
      bitmap_size,
      reverse_v ? { v: -1 } : {}
    );
    canvas_ctx.scale(canvas_size / bitmap_size, canvas_size / bitmap_size);
    canvas_ctx.drawImage(canvas_bit, 0, 0);
  });
}); // ending onMounted

function fullscreen() {
  const elem: any = document.documentElement;
  elem.requestFullscreen?.();
  elem.mozRequestFullScreen?.();
  elem.webkitRequestFullscreen?.();
}
</script>
