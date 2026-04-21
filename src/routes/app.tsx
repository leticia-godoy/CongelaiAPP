import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowflake, Trash2, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddItemForm } from "@/components/AddItemForm";
import {
  useFreezerItems,
  TYPE_LABELS,
  SIZE_LABELS,
  daysUntil,
  type FreezerItem,
} from "@/hooks/use-freezer-items";

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

          <section className="space-y-3">
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
            ) : (
              items.map((item) => (
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
