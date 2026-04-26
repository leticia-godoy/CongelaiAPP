import * as XLSX from "xlsx-js-style";
import {
  type FreezerItem,
  TYPE_LABELS,
  SIZE_LABELS,
  daysUntil,
} from "@/hooks/use-freezer-items";

function formatDateBR(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

function statusLabel(days: number): string {
  if (days < 0) return `Vencido há ${Math.abs(days)}d`;
  if (days === 0) return "Vence hoje";
  if (days <= 7) return `Vence em ${days}d`;
  return "Em dia";
}

type CellStyle = NonNullable<XLSX.CellObject["s"]>;

const HEADER_STYLE: CellStyle = {
  font: { bold: true, color: { rgb: "FFFFFFFF" }, sz: 11 },
  fill: { patternType: "solid", fgColor: { rgb: "FF2563EB" } },
  alignment: { horizontal: "left", vertical: "center" },
  border: {
    bottom: { style: "thin", color: { rgb: "FF1E40AF" } },
  },
};

const TITLE_STYLE: CellStyle = {
  font: { bold: true, sz: 14, color: { rgb: "FF1E3A8A" } },
  alignment: { horizontal: "left", vertical: "center" },
};

const ROW_EXPIRED_STYLE: CellStyle = {
  fill: { patternType: "solid", fgColor: { rgb: "FFFEE2E2" } },
  font: { color: { rgb: "FF991B1B" } },
};

const ROW_SOON_STYLE: CellStyle = {
  fill: { patternType: "solid", fgColor: { rgb: "FFFEF3C7" } },
  font: { color: { rgb: "FF92400E" } },
};

const ROW_OK_STYLE: CellStyle = {
  font: { color: { rgb: "FF111827" } },
};

function rowStyleFor(days: number): CellStyle {
  if (days < 0 || days === 0) return ROW_EXPIRED_STYLE;
  if (days <= 7) return ROW_SOON_STYLE;
  return ROW_OK_STYLE;
}

export function exportItemsToXlsx(items: FreezerItem[]): void {
  const headers = [
    "Item",
    "Tipo",
    "Tamanho",
    "Congelado em",
    "Validade",
    "Dias restantes",
    "Status",
  ];

  const rows = items.map((item) => {
    const days = daysUntil(item.expiresAt);
    return [
      item.name,
      TYPE_LABELS[item.type],
      SIZE_LABELS[item.size],
      formatDateBR(item.frozenAt),
      formatDateBR(item.expiresAt),
      days,
      statusLabel(days),
    ];
  });

  const today = new Date().toLocaleDateString("pt-BR");
  const titleRow = [`Lista do freezer — exportada em ${today}`];
  const blankRow: string[] = [];

  const aoa: (string | number)[][] = [titleRow, blankRow, headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Title styling
  const titleCell = ws["A1"] as XLSX.CellObject | undefined;
  if (titleCell) titleCell.s = TITLE_STYLE;
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];

  // Header row (row index 2 = Excel row 3)
  for (let c = 0; c < headers.length; c++) {
    const addr = XLSX.utils.encode_cell({ r: 2, c });
    const cell = ws[addr] as XLSX.CellObject | undefined;
    if (cell) cell.s = HEADER_STYLE;
  }

  // Data rows
  items.forEach((item, i) => {
    const days = daysUntil(item.expiresAt);
    const style = rowStyleFor(days);
    const r = 3 + i; // header is at row 2
    for (let c = 0; c < headers.length; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr] as XLSX.CellObject | undefined;
      if (cell) cell.s = { ...style };
    }
  });

  // Column widths
  ws["!cols"] = [
    { wch: 30 }, // Item
    { wch: 12 }, // Tipo
    { wch: 12 }, // Tamanho
    { wch: 14 }, // Congelado em
    { wch: 14 }, // Validade
    { wch: 16 }, // Dias restantes
    { wch: 18 }, // Status
  ];

  // Header row taller
  ws["!rows"] = [{ hpt: 22 }, { hpt: 8 }, { hpt: 20 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Itens a vencer");

  const isoDate = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `freezer-${isoDate}.xlsx`);
}
