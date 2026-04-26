import { createFileRoute, Link } from "@tanstack/react-router";
import { Snowflake, Calendar, Package, Search, Bell, Sparkles, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import freezerHero from "@/assets/freezer-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "congela.ai — Organize seu congelador com inteligência" },
      {
        name: "description",
        content:
          "Acompanhe tudo o que tem no seu freezer: validade, tipo de comida e tamanho das marmitas. Nunca mais desperdice nada.",
      },
      { property: "og:title", content: "congela.ai — Organize seu congelador" },
      {
        property: "og:description",
        content: "Liste tudo do seu freezer e mantenha controle de datas e marmitas.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-cta flex items-center justify-center shadow-frost">
              <Snowflake className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">
              congela<span className="text-primary">.ai</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-smooth">Recursos</a>
            <a href="#how" className="hover:text-foreground transition-smooth">Como funciona</a>
          </nav>
          <Link to="/app">
            <Button variant="default" className="bg-gradient-cta shadow-frost hover:shadow-glow transition-smooth">
              Começar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-frost">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-ice blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-deep">
              Tudo o que está no seu{" "}
              <span className="bg-gradient-cta bg-clip-text text-transparent">congelador</span>,
              na palma da mão.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Cadastre marmitas, carnes e congelados. Acompanhe validade, tipo de comida e
              porções — chega de descobrir aquele pacote esquecido há 6 meses.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/app">
                <Button size="lg" className="bg-gradient-cta shadow-frost hover:shadow-glow transition-smooth h-14 px-8 text-base w-full sm:w-auto">
                  Ver o que tenho no freezer
                  <ArrowRight className="ml-1 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Facinho para começar</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Sem aperreio</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-cta rounded-3xl blur-2xl opacity-30" />
            <div className="relative rounded-3xl overflow-hidden shadow-frost border border-border">
              <img
                src={freezerHero}
                alt="Congelador organizado com marmitas etiquetadas"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-frost border border-border p-4 flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Lembrete</div>
                <div className="text-sm font-semibold text-deep">Lasanha vence amanhã</div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-card rounded-2xl shadow-frost border border-border p-4 flex items-center gap-3 animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center">
                <Package className="w-5 h-5 text-deep" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">No freezer</div>
                <div className="text-sm font-semibold text-deep">24 itens</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-deep mb-4">
              Tudo que você precisa para nunca mais perder comida
            </h2>
            <p className="text-lg text-muted-foreground">
              Recursos pensados para quem cozinha em casa e quer aproveitar cada porção.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-gradient-card border border-border shadow-soft hover:shadow-frost transition-smooth hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-cta flex items-center justify-center shadow-frost mb-5 group-hover:scale-110 transition-smooth">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-deep mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-gradient-frost">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-deep mb-4">
              Comece em 3 passos
            </h2>
            <p className="text-lg text-muted-foreground">Simples como abrir a porta do freezer.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-card border border-border shadow-frost flex items-center justify-center text-2xl font-bold font-display text-primary">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-deep mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-cta p-12 md:p-16 text-center overflow-hidden shadow-frost">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent blur-3xl" />
            </div>
            <div className="relative">
              <Snowflake className="w-12 h-12 text-primary-foreground mx-auto mb-6 animate-float" />
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Vamos descongelar essa bagunça?
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
                Junte-se a quem já economiza tempo e dinheiro com um freezer organizado.
              </p>
              <Link to="/app">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-base shadow-soft">
                  Começar agora
                  <ArrowRight className="ml-1 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-cta flex items-center justify-center">
              <Snowflake className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-deep">
              congela<span className="text-primary">.ai</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} congela.ai
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Calendar,
    title: "Controle de validade",
    desc: "Cadastre a data que congelou e receba alertas antes de vencer. Nada mais é esquecido.",
  },
  {
    icon: Package,
    title: "Tipo e tamanho",
    desc: "Marmita individual, porção de família, carne crua ou cozida — categorize do seu jeito.",
  },
  {
    icon: Search,
    title: "Busca instantânea",
    desc: "Encontre em segundos onde está aquela lasanha que você fez no domingo passado.",
  },
  {
    icon: Bell,
    title: "Alertas",
    desc: "Notificações antes do vencimento para você consumir no melhor momento.",
  },
  {
    icon: Snowflake,
    title: "Organização visual",
    desc: "Veja tudo em listas e gavetas virtuais. Saiba o que tem sem abrir a porta.",
  },
];

const steps = [
  { title: "Cadastre os itens", desc: "Adicione comida, data e tamanho da porção em segundos." },
  { title: "Acompanhe tudo", desc: "Veja seu inventário a qualquer momento, no celular ou no PC." },
  { title: "Cozinhe sem desperdício", desc: "Receba lembretes e use cada marmita no tempo certo." },
];
