import { formatDate } from "@/lib/format";

import type { OrgPerson } from "./org";

/*
 * Org chart exports, as BambooHR offers them: a drawn chart (PNG or PDF) of what is on
 * screen or of one person's part of the tree, and CSV files shaped for Visio, Lucidchart or
 * plain use. All of it is built in the browser from the org chart data already loaded.
 */

export type Include = { name: boolean; photo: boolean; department: boolean; location: boolean; legalEntity: boolean; hireDate: boolean };
export const DEFAULT_INCLUDE: Include = { name: true, photo: true, department: true, location: false, legalEntity: false, hireDate: false };

type Tree = { roots: OrgPerson[]; childrenOf: (p: OrgPerson) => OrgPerson[] };

/** The tree on screen: roots, and the reports of every expanded person. */
export function screenTree(roots: OrgPerson[], children: Map<string, OrgPerson[]>, expanded: Set<string>): Tree {
  return { roots, childrenOf: (p) => (expanded.has(p.id) ? children.get(p.id) ?? [] : []) };
}

/** One person and `levels` levels below them (levels 1 is just them). */
export function subTree(start: OrgPerson, children: Map<string, OrgPerson[]>, levels: number): Tree {
  const depth = new Map<string, number>([[start.id, 1]]);
  return {
    roots: [start],
    childrenOf: (p) => {
      const d = depth.get(p.id) ?? levels;
      if (d >= levels) return [];
      const kids = children.get(p.id) ?? [];
      kids.forEach((k) => depth.set(k.id, d + 1));
      return kids;
    },
  };
}

/* --------------------------------------------------------------------- Drawing */

const CARD_W = 200;
const GAP_X = 24;
const GAP_Y = 56;
const PAD = 48;
const SCALE = 2;
const MAX_SIDE = 16000; // browsers refuse canvases much larger than this
const INK = "#1f2523";
const MUTED = "#646a67";
const LINE = "#b9bcb4";
const BORDER = "#d3d3cb";
const BRAND = "#2f6b4f";

type Placed = { p: OrgPerson; x: number; y: number; kids: Placed[] };

function lines(p: OrgPerson, inc: Include) {
  return [
    inc.name ? { text: p.fullName, bold: true } : null,
    { text: p.jobTitle ?? "No job title", bold: !inc.name },
    inc.department && p.department ? { text: p.department } : null,
    inc.location && p.location ? { text: p.location } : null,
    inc.legalEntity && p.legalEntity ? { text: p.legalEntity } : null,
    inc.hireDate && p.hireDate ? { text: `Hired ${formatDate(p.hireDate)}` } : null,
  ].filter(Boolean) as { text: string; bold?: boolean }[];
}

function layout(tree: Tree, cardH: number) {
  const width = new Map<string, number>();
  const measure = (p: OrgPerson): number => {
    const kids = tree.childrenOf(p);
    const w = Math.max(CARD_W, kids.reduce((s, k) => s + measure(k), 0) + GAP_X * Math.max(0, kids.length - 1));
    width.set(p.id, w);
    return w;
  };
  const place = (p: OrgPerson, left: number, y: number): Placed => {
    const w = width.get(p.id)!;
    const kids = tree.childrenOf(p);
    const total = kids.reduce((s, k) => s + width.get(k.id)!, 0) + GAP_X * Math.max(0, kids.length - 1);
    let x = left + (w - total) / 2;
    const placed: Placed[] = [];
    for (const k of kids) {
      placed.push(place(k, x, y + cardH + GAP_Y));
      x += width.get(k.id)! + GAP_X;
    }
    return { p, x: left + w / 2 - CARD_W / 2, y, kids: placed };
  };
  let left = PAD;
  let bottom = 0;
  const top = PAD + 56;
  const placed = tree.roots.map((r) => {
    const w = measure(r);
    const node = place(r, left, top);
    left += w + GAP_X * 2;
    return node;
  });
  const walk = (n: Placed) => { bottom = Math.max(bottom, n.y + cardH); n.kids.forEach(walk); };
  placed.forEach(walk);
  return { placed, width: left - GAP_X * 2 + PAD, height: bottom + PAD };
}

async function loadPhoto(p: OrgPerson): Promise<ImageBitmap | null> {
  if (!p.photoUrl) return null;
  try {
    // From our own address: a photo straight from file storage would taint the canvas.
    const res = await fetch(`/api/employees/${p.id}/photo/`, { credentials: "include" });
    return res.ok ? await createImageBitmap(await res.blob()) : null;
  } catch {
    return null;
  }
}

function fit(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(`${s}…`).width > max) s = s.slice(0, -1);
  return `${s}…`;
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export async function drawChart(tree: Tree, inc: Include, title: string): Promise<HTMLCanvasElement> {
  const maxLines = Math.max(1, ...collect(tree).map((p) => lines(p, inc).length));
  const photo = inc.photo ? 64 : 0;
  const cardH = 20 + photo + maxLines * 18 + 14;
  const { placed, width, height } = layout(tree, cardH);
  const scale = Math.min(SCALE, MAX_SIDE / width, MAX_SIDE / height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = INK;
  ctx.font = "600 20px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(title, PAD, PAD - 8);

  const photos = new Map<string, ImageBitmap | null>();
  if (inc.photo) await Promise.all(collect(tree).map(async (p) => photos.set(p.id, await loadPhoto(p))));

  const draw = (n: Placed) => {
    const cx = n.x + CARD_W / 2;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1.5;
    for (const k of n.kids) {
      const mid = n.y + cardH + GAP_Y / 2;
      ctx.beginPath();
      ctx.moveTo(cx, n.y + cardH);
      ctx.lineTo(cx, mid);
      ctx.lineTo(k.x + CARD_W / 2, mid);
      ctx.lineTo(k.x + CARD_W / 2, k.y);
      ctx.stroke();
    }
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = BORDER;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(n.x, n.y, CARD_W, cardH, 10);
    ctx.fill();
    ctx.stroke();
    let y = n.y + 14;
    if (inc.photo) {
      const img = photos.get(n.p.id);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cx - 28, y, 56, 56, 12);
      ctx.clip();
      if (img) {
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, cx - 28, y, 56, 56);
      } else {
        ctx.fillStyle = "#eeeee8";
        ctx.fillRect(cx - 28, y, 56, 56);
        ctx.fillStyle = MUTED;
        ctx.font = "600 18px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(initials(n.p.fullName), cx, y + 28);
      }
      ctx.restore();
      y += photo;
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (const line of lines(n.p, inc)) {
      ctx.font = `${line.bold ? "600 14px" : "13px"} system-ui, -apple-system, Segoe UI, sans-serif`;
      ctx.fillStyle = line.bold ? BRAND : MUTED;
      ctx.fillText(fit(ctx, line.text, CARD_W - 20), cx, y);
      y += 18;
    }
    ctx.textAlign = "left";
    if (n.kids.length) {
      ctx.fillStyle = MUTED;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(String(tree.childrenOf(n.p).length), n.x + CARD_W - 10, n.y + cardH - 16);
      ctx.textAlign = "left";
    }
    n.kids.forEach(draw);
  };
  placed.forEach(draw);
  return canvas;
}

function collect(tree: Tree) {
  const out: OrgPerson[] = [];
  const walk = (p: OrgPerson) => { out.push(p); tree.childrenOf(p).forEach(walk); };
  tree.roots.forEach(walk);
  return out;
}

/** A one-page PDF holding the chart as a JPEG, sized to the chart. */
export function canvasToPdf(canvas: HTMLCanvasElement): Blob {
  const jpeg = atob(canvas.toDataURL("image/jpeg", 0.92).split(",")[1]);
  const w = canvas.width;
  const h = canvas.height;
  // Points at 144 dpi: the canvas is drawn at twice the size of the chart.
  const pw = (w * 72) / 144;
  const ph = (h * 72) / 144;
  const content = `q ${pw.toFixed(2)} 0 0 ${ph.toFixed(2)} 0 0 cm /Im0 Do Q`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw.toFixed(2)} ${ph.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
    `<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n${jpeg}\nendstream`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n%âãÏÓ\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  // Every character above is one byte (the JPEG came out of atob as bytes), so copy them as is.
  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return new Blob([bytes], { type: "application/pdf" });
}

export function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ------------------------------------------------------------------------- CSV */

const cell = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v);

function csv(headers: string[], rows: string[][]) {
  // A byte-order mark so Excel reads names with accents correctly.
  return new Blob(["﻿" + [headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
}

const key = (p: OrgPerson) => p.employeeNumber || p.id;

export type CsvKind = "visio" | "lucidchart" | "plain";

/** Everyone, managers before their reports, in the shape each tool imports. */
export function orgCsv(kind: CsvKind, people: OrgPerson[], byId: Map<string, OrgPerson>, level: Map<string, number>) {
  const sorted = [...people].sort((a, b) => (level.get(a.id) ?? 0) - (level.get(b.id) ?? 0) || a.fullName.localeCompare(b.fullName));
  const boss = (p: OrgPerson) => (p.managerId ? byId.get(p.managerId) : undefined);
  const phone = (p: OrgPerson) => (p.workPhone ? `${p.workPhone}${p.workPhoneExt ? ` x${p.workPhoneExt}` : ""}` : "");
  if (kind === "visio") {
    // Visio's Organization Chart Wizard: pick Unique_ID as the identifier and Reports_To as the manager column.
    return csv(["Unique_ID", "Name", "Title", "Reports_To", "Department", "Location", "E-mail", "Telephone"],
      sorted.map((p) => [key(p), p.fullName, p.jobTitle ?? "", boss(p) ? key(boss(p)!) : "", p.department ?? "", p.location ?? "", p.workEmail, phone(p)]));
  }
  if (kind === "lucidchart") {
    // Lucidchart's org chart import: an Id per person and the Id of their manager.
    return csv(["Id", "Name", "Title", "Manager Id", "Department", "Location", "Email", "Phone"],
      sorted.map((p) => [key(p), p.fullName, p.jobTitle ?? "", boss(p) ? key(boss(p)!) : "", p.department ?? "", p.location ?? "", p.workEmail, phone(p)]));
  }
  return csv(["Employee #", "Name", "Job title", "Department", "Location", "Legal entity", "Work email", "Work phone", "Reports to", "Reports to (employee #)", "Direct reports", "Hire date"],
    sorted.map((p) => [p.employeeNumber, p.fullName, p.jobTitle ?? "", p.department ?? "", p.location ?? "", p.legalEntity ?? "", p.workEmail, phone(p),
      boss(p)?.fullName ?? "", boss(p) ? boss(p)!.employeeNumber : "", String(p.directReportCount), p.hireDate ?? ""]));
}
