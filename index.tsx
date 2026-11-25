import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Award, ShoppingBag, Snowflake, Plane } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImg from "@/assets/hero.jpg";
import { PRODUCTS, type Audience } from "@/lib/maestri/products";
import { setAudience, setCartOpen, track, useStore } from "@/lib/maestri/store";
import { CartDrawer } from "@/components/maestri/CartDrawer";
import { CheckoutModal } from "@/components/maestri/CheckoutModal";
import { ProductCard } from "@/components/maestri/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { audience?: string } =>
    typeof s["audience"] === "string" ? { audience: s["audience"] } : {},
  head: () => ({
    meta: [
      { title: "MAESTRI · Italian Charcuterie, Sliced Fresh & Shipped Cold" },
      { name: "description", content: "Authentic Prosciutto di Parma, San Daniele & artisanal salumi — aged in Italy, sliced to order in Vineland, NJ, delivered ≤40°F." },
      { property: "og:title", content: "MAESTRI · Charcuterie Masters" },
      { property: "og:description", content: "400 days of Italian craft. Sliced fresh in NJ and delivered cold to your door." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Storefront,
});

const FAQ = [
  ["How does it stay under 40°F in transit?", "Every order ships in an insulated thermal liner with food-safe gel cold-packs, sized for 48–72 hours. We ship Monday–Wednesday only so nothing sits in a warehouse over a weekend. If your box arrives above 40°F, we replace it — no questions asked."],
  ["How long does sliced charcuterie last?", "Sealed, parchment-interleaved trays keep 21 days refrigerated. Once opened, enjoy within 3–5 days. Whole legs keep for months when stored properly."],
  ["When is my order sliced?", "To order. Every tray is sliced in Vineland, NJ within 24 hours of shipping, and the slicing date is printed on the label."],
  ["Are the products really from Italy?", "Yes. Our prosciutto, speck and salumi are aged in Parma, San Daniele and Alto Adige by producers we’ve worked with for three generations. We only do the final slicing here."],
  ["What are the restaurant case minimums?", "There’s no long-term contract. Restaurant cases start at a single case ($128), and refrigerated freight is free over $250."],
];

function Storefront() {
  const { audience: urlAudience } = Route.useSearch();
  const audience = useStore((s) => s.audience);
  const count = useStore((s) => s.cart.reduce((n, l) => n + l.qty, 0));
  const [checkout, setCheckout] = useState(false);
  const catalogRef = useRef<HTMLElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    if (urlAudience === "restaurant" || urlAudience === "home") setAudience(urlAudience);
    track("page_view");
  }, [urlAudience]);

  const switchTo = (a: Audience, scroll = false) => {
    setAudience(a);
    if (scroll) catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const products = PRODUCTS.filter((p) => p.audience === audience);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-ink px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-foreground">
        Authentic Italian-Aged Charcuterie · Freshly Sliced in NJ · Guaranteed Cold Delivery (≤40°F)
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="font-display text-2xl font-black tracking-[0.12em]">
            MAESTRI<span className="text-primary">.</span>
          </a>
          <div className="hidden gap-8 text-sm font-semibold md:flex">
            <a href="#shop" className="hover:text-primary">Shop Boxes</a>
            <a href="#craft" className="hover:text-primary">Our Craft</a>
            <a href="#cold-chain" className="hover:text-primary">Cold-Chain Guarantee</a>
          </div>
          <button onClick={() => setCartOpen(true)} className="relative p-2" aria-label="Open cart">
            <ShoppingBag className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{count}</span>
            )}
          </button>
        </nav>
      </header>

      <section id="top" className="relative overflow-hidden bg-ink text-ink-foreground">
        <img src={heroImg} alt="Hand-sliced Prosciutto di Parma on olive wood" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="bg-hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:py-36">
          <p className="eyebrow text-primary">Charcuterie Masters · Vineland, NJ</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] md:text-6xl">
            400 Days of Italian Craft. Sliced Fresh & Delivered Cold to Your Door.
          </h1>
          <p className="mt-6 max-w-xl font-serif text-lg text-ink-foreground/80 md:text-xl">
            Authentic Prosciutto di Parma, San Daniele, and artisanal salumi—aged in Italy, sliced to order in Vineland, NJ, and shipped in insulated cold-packs.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={() => switchTo("home", true)} className="bg-primary px-7 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:brightness-110">Explore Tasting Boxes</button>
            <button onClick={() => switchTo("restaurant", true)} className="border border-ink-foreground/60 px-7 py-4 text-sm font-bold uppercase tracking-widest hover:bg-ink-foreground hover:text-ink">Restaurant & Chef Orders</button>
          </div>
        </div>
      </section>

      <section id="craft" className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-3">
          {[
            [Plane, "Imported from Italy, Sliced in NJ", "Peak freshness, parchment-interleaved slices that never tear."],
            [Snowflake, "Guaranteed ≤40°F Cold Delivery", "48–72h insulated thermal shippers with replacement guarantee."],
            [Award, "3 Generations of Salumeria Mastery", "Clean ingredients, verified aging."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Plane;
            return (
              <div key={t as string} className="bg-background p-8">
                <I className="h-7 w-7 text-primary" />
                <h3 className="mt-4 text-lg font-extrabold">{t as string}</h3>
                <p className="mt-1.5 font-serif text-base text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="shop" ref={catalogRef} className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow text-primary">The Salumeria</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">{audience === "home" ? "Tasting & Gift Boxes" : "Foodservice Cases"}</h2>
          <div className="mt-8 inline-flex rounded-full border border-foreground p-1">
            {(["home", "restaurant"] as const).map((a) => (
              <button key={a} onClick={() => switchTo(a)}
                className={cn("rounded-full px-5 py-2.5 text-sm font-bold transition md:px-7",
                  audience === a ? "bg-foreground text-background" : "hover:text-primary")}>
                {a === "home" ? "For Home & Gifting" : "For Restaurants & Chefs"}
              </button>
            ))}
          </div>
          <p className="mt-4 font-serif text-muted-foreground">
            {audience === "home" ? "Free insulated cold-pack shipping over $95." : "Free refrigerated freight over $250 · low minimums, no contracts."}
          </p>
        </div>
        <div className={cn("mt-12 grid gap-6 sm:grid-cols-2", products.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {products.map((p) => <ProductCard key={p.sku} product={p} />)}
        </div>
      </section>

      <section id="cold-chain" className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow text-primary">Cold-Chain Guarantee</p>
            <h2 className="mt-3 text-4xl font-black leading-tight">Every slice arrives cold, or it’s on us.</h2>
            <p className="mt-4 font-serif text-lg text-ink-foreground/70">Straight answers to the questions every first-time buyer asks.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q as string} className="border-ink-foreground/15">
                <AccordionTrigger className="text-left text-base font-bold hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="font-serif text-base text-ink-foreground/75">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-10 text-sm text-muted-foreground md:flex-row">
        <span className="font-display font-black tracking-[0.12em] text-foreground">MAESTRI<span className="text-primary">.</span></span>
        <span>Vineland, New Jersey · Aged in Italy, sliced in NJ</span>
        <Link to="/insights" className="hover:text-primary">Insights</Link>
      </footer>

      <CartDrawer onCheckout={() => setCheckout(true)} />
      <CheckoutModal open={checkout} onOpenChange={setCheckout} />
    </div>
  );
}
