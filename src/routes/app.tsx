import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowflake, Trash2, Package, ArrowLeft, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AddItemForm } from "@/components/AddItemForm";
import {
  useFreezerItems,
  TYPE_LABELS,
  SIZE_LABELS,
  daysUntil,
  type FreezerItem,
  type FreezerItemType,
  type FreezerItemSize,
} from "@/hooks/use-freezer-items";

type TypeFilter = FreezerItemType | "all";
type SizeFilter = FreezerItemSize | "all";
type StatusFilter = "all" | "expired" | "soon" | "ok";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Meu freezer — congela.ai" },
      {
        name: "description",
        content:
          "Cadastre e acompanhe os itens do seu congelador: validade, tipo e tamanho da porção.",
      },
    ],
  }),
  component: FreezerApp,
});

function expiryBadge(item: FreezerItem) {
  const days = daysUntil(item.expiresAt);
  if (days < 0) return <Badge variant="destructive">Vencido há {Math.abs(days)}d</Badge>;
  if (days === 0) return <Badge variant="destructive">Vence hoje</Badge>;
  if (days <= 7) return <Badge className="bg-accent text-deep hover:bg-accent">Vence em {days}d</Badge>;
  return <Badge variant="secondary">Vence em {days}d</Badge>;
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

function FreezerApp() {
  const { items, addItem, removeItem, hydrated } = useFreezerItems();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (sizeFilter !== "all" && item.size !== sizeFilter) return false;
      if (statusFilter !== "all") {
        const days = daysUntil(item.expiresAt);
        if (statusFilter === "expired" && days >= 0) return false;
        if (statusFilter === "soon" && (days < 0 || days > 7)) return false;
        if (statusFilter === "ok" && days <= 7) return false;
      }
      return true;
    });
  }, [items, search, typeFilter, sizeFilter, statusFilter]);

  const hasActiveFilters =
    search !== "" || typeFilter !== "all" || sizeFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setSizeFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-gradient-frost">
      <header className="bg-card/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-cta flex items-center justify-center shadow-frost">
              <Snowflake className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">
              congela<span className="text-primary">.ai</span>
            </span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Início
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-deep mb-2">Meu freezer</h1>
          <p className="text-muted-foreground">
            {hydrated && items.length > 0
              ? `${items.length} ${items.length === 1 ? "item cadastrado" : "itens cadastrados"}`
              : "Comece adicionando o que está no seu congelador."}
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
          <AddItemForm onAdd={addItem} />

          <section className="space-y-4">
            {hydrated && items.length > 0 && (
              <Collapsible
                open={filtersOpen}
                onOpenChange={setFiltersOpen}
                className="bg-card border border-border rounded-2xl shadow-soft"
              >
                <div className="flex items-center justify-between gap-2 p-4">
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm font-semibold text-deep flex-1 text-left"
                    >
                      <Filter className="w-4 h-4 text-primary" />
                      Filtros
                      {hasActiveFilters && (
                        <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                          ativos
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${
                          filtersOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2">
                      <X className="w-3.5 h-3.5 mr-1" />
                      Limpar
                    </Button>
                  )}
                </div>
                <CollapsibleContent className="px-4 pb-4 space-y-3">
                  <Input
                    placeholder="Buscar pelo nome..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        {(Object.keys(TYPE_LABELS) as FreezerItemType[]).map((t) => (
                          <SelectItem key={t} value={t}>
                            {TYPE_LABELS[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sizeFilter} onValueChange={(v) => setSizeFilter(v as SizeFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os tamanhos</SelectItem>
                        {(Object.keys(SIZE_LABELS) as FreezerItemSize[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {SIZE_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={statusFilter}
                      onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="expired">Vencidos</SelectItem>
                        <SelectItem value="soon">Vence em até 7d</SelectItem>
                        <SelectItem value="ok">Em dia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {hasActiveFilters && (
                    <p className="text-xs text-muted-foreground">
                      Mostrando {filteredItems.length} de {items.length}{" "}
                      {items.length === 1 ? "item" : "itens"}
                    </p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}

            {!hydrated ? null : items.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-deep mb-1">Freezer vazio</h3>
                <p className="text-muted-foreground text-sm">
                  Cadastre seu primeiro item no formulário ao lado.
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Filter className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-deep mb-1">Nenhum item encontrado</h3>
                <p className="text-muted-foreground text-sm">
                  Tente ajustar ou limpar os filtros.
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-frost transition-smooth flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Snowflake className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-deep truncate">{item.name}</h3>
                      {expiryBadge(item)}
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                      <span>{TYPE_LABELS[item.type]}</span>
                      <span>{SIZE_LABELS[item.size]}</span>
                      <span>Congelado em {formatDate(item.frozenAt)}</span>
                      <span>Validade {formatDate(item.expiresAt)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remover ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </article>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
