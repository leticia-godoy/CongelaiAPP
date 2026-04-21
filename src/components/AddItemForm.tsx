import { useState, FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FreezerItemType, FreezerItemSize } from "@/hooks/use-freezer-items";

interface AddItemFormProps {
  onAdd: (data: {
    name: string;
    frozenAt: string;
    expiresAt: string;
    type: FreezerItemType;
    size: FreezerItemSize;
  }) => void;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState("");
  const [frozenAt, setFrozenAt] = useState(todayIso());
  const [expiresAt, setExpiresAt] = useState(plusDaysIso(90));
  const [type, setType] = useState<FreezerItemType>("marmita");
  const [size, setSize] = useState<FreezerItemSize>("individual");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), frozenAt, expiresAt, type, size });
    setName("");
    setFrozenAt(todayIso());
    setExpiresAt(plusDaysIso(90));
    setType("marmita");
    setSize("individual");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-2xl p-6 shadow-soft space-y-4"
    >
      <h2 className="text-lg font-bold text-deep">Adicionar item</h2>

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Lasanha de berinjela"
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="frozenAt">Congelado em</Label>
          <Input
            id="frozenAt"
            type="date"
            value={frozenAt}
            onChange={(e) => setFrozenAt(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiresAt">Validade</Label>
          <Input
            id="expiresAt"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select value={type} onValueChange={(v) => setType(v as FreezerItemType)}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marmita">Marmita</SelectItem>
              <SelectItem value="carne">Carne</SelectItem>
              <SelectItem value="vegetal">Vegetal</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Tamanho da porção</Label>
          <Select value={size} onValueChange={(v) => setSize(v as FreezerItemSize)}>
            <SelectTrigger id="size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="familia">Família</SelectItem>
              <SelectItem value="grande">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-cta shadow-frost hover:shadow-glow transition-smooth h-12"
      >
        <Plus className="w-4 h-4 mr-1" />
        Adicionar ao freezer
      </Button>
    </form>
  );
}