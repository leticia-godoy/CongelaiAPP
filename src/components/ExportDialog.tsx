import { useMemo, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  type FreezerItem,
  type FreezerItemType,
  type FreezerItemSize,
  TYPE_LABELS,
  SIZE_LABELS,
  daysUntil,
} from "@/hooks/use-freezer-items";
import { exportItemsToXlsx } from "@/lib/export-xlsx";

type RangeOption = "expired" | "3" | "7" | "15" | "30" | "custom" | "all";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: FreezerItem[];
}

const TYPES = Object.keys(TYPE_LABELS) as FreezerItemType[];
const SIZES = Object.keys(SIZE_LABELS) as FreezerItemSize[];

export function ExportDialog({ open, onOpenChange, items }: ExportDialogProps) {
  const [range, setRange] = useState<RangeOption>("7");
  const [customDays, setCustomDays] = useState<string>("14");
  const [selectedTypes, setSelectedTypes] = useState<FreezerItemType[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<FreezerItemSize[]>([]);

  const customDaysNum = Number(customDays);
  const customInvalid =
    range === "custom" && (!customDays || Number.isNaN(customDaysNum) || customDaysNum < 0);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) return false;
      // Size filter
      if (selectedSizes.length > 0 && !selectedSizes.includes(item.size)) return false;
      // Range filter
      if (range === "all") return true;
      const days = daysUntil(item.expiresAt);
      if (range === "expired") return days < 0;
      const limit =
        range === "custom" ? customDaysNum : Number(range);
      if (Number.isNaN(limit)) return false;
      // include vencidos + a vencer dentro do limite
      return days <= limit;
    });
  }, [items, range, customDaysNum, selectedTypes, selectedSizes]);

  function toggleType(t: FreezerItemType) {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function toggleSize(s: FreezerItemSize) {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function handleDownload() {
    if (filteredItems.length === 0 || customInvalid) return;
    try {
      exportItemsToXlsx(filteredItems);
      toast.success(
        `Planilha baixada com ${filteredItems.length} ${
          filteredItems.length === 1 ? "item" : "itens"
        }`,
      );
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível gerar a planilha");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Exportar lista
          </DialogTitle>
          <DialogDescription>
            Escolha o que entra na planilha e baixe em Excel formatado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-3">
            <Label className="text-deep">Intervalo de vencimento</Label>
            <RadioGroup value={range} onValueChange={(v) => setRange(v as RangeOption)}>
              <RangeRadio value="expired" label="Apenas vencidos" />
              <RangeRadio value="3" label="Vence em até 3 dias (inclui vencidos)" />
              <RangeRadio value="7" label="Vence em até 7 dias (inclui vencidos)" />
              <RangeRadio value="15" label="Vence em até 15 dias (inclui vencidos)" />
              <RangeRadio value="30" label="Vence em até 30 dias (inclui vencidos)" />
              <div className="flex items-center gap-3">
                <RangeRadio value="custom" label="Personalizado" />
                {range === "custom" && (
                  <div className="flex items-center gap-2 ml-2">
                    <Input
                      type="number"
                      min={0}
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      className="w-20 h-8"
                    />
                    <span className="text-sm text-muted-foreground">dias</span>
                  </div>
                )}
              </div>
              <RangeRadio value="all" label="Todos os itens" />
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-deep">Tipo (opcional)</Label>
            <p className="text-xs text-muted-foreground">
              Nada selecionado = todos os tipos
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <CheckRow
                  key={t}
                  id={`type-${t}`}
                  label={TYPE_LABELS[t]}
                  checked={selectedTypes.includes(t)}
                  onCheckedChange={() => toggleType(t)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-deep">Tamanho (opcional)</Label>
            <p className="text-xs text-muted-foreground">
              Nada selecionado = todos os tamanhos
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((s) => (
                <CheckRow
                  key={s}
                  id={`size-${s}`}
                  label={SIZE_LABELS[s]}
                  checked={selectedSizes.includes(s)}
                  onCheckedChange={() => toggleSize(s)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-muted/60 border border-border px-4 py-3 text-sm">
            <span className="font-semibold text-deep">{filteredItems.length}</span>{" "}
            <span className="text-muted-foreground">
              {filteredItems.length === 1 ? "item será exportado" : "itens serão exportados"}
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleDownload}
            disabled={filteredItems.length === 0 || customInvalid}
            className="bg-gradient-cta shadow-frost hover:shadow-glow transition-smooth"
          >
            <Download className="w-4 h-4 mr-1" />
            Baixar Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RangeRadio({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem value={value} id={`range-${value}`} />
      <Label htmlFor={`range-${value}`} className="font-normal cursor-pointer">
        {label}
      </Label>
    </div>
  );
}

function CheckRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-smooth"
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <span className="text-sm">{label}</span>
    </label>
  );
}
