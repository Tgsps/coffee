// In-memory datastore for environments without MongoDB

/** @typedef {{
 *  _id?: string,
 *  name: string,
 *  description: string,
 *  price: number,
 *  category: 'coffee'|'espresso'|'latte'|'cappuccino'|'cold-brew'|'specialty',
 *  image: string,
 *  images?: string[],
 *  inStock?: boolean,
 *  stockQuantity?: number,
 *  featured?: boolean,
 *  rating?: number,
 *  reviews?: Array<{ user?: any, rating: number, comment?: string, createdAt?: Date }>
 * }} ProductItem */

/** @type {{ products: ProductItem[] }} */
const store = {
  products: [
    { name: "Ethiopia Yirgacheffe Single-Origin", description: "Floral and citrus-forward with a tea-like body. Washed process from Yirgacheffe; bright, elegant finish.", price: 18.99, category: "coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 120, featured: true, rating: 4.7 },
    { name: "Colombia Supremo Single-Origin", description: "Balanced body with caramel sweetness and cocoa undertones. Crowd-pleasing daily brew.", price: 16.50, category: "coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 150, featured: true, rating: 4.6 },
    { name: "Kenya AA Single-Origin", description: "Vibrant acidity with blackcurrant, grapefruit, and wine-like complexity. Big, expressive cup.", price: 19.50, category: "coffee", image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 90, featured: true, rating: 4.8 },
    { name: "Signature Espresso Blend", description: "Chocolate, almond, and orange zest with syrupy body. Built to shine in milk drinks.", price: 17.50, category: "espresso", image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 200, featured: true, rating: 4.6 },
    { name: "Midnight Dark Roast", description: "Deep roast with dark chocolate, molasses, and a lingering, smooth finish. Low acidity.", price: 16.75, category: "coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 110, featured: false, rating: 4.4 },
    { name: "House Medium Roast", description: "Balanced and smooth with notes of milk chocolate and toasted hazelnut. All-day drinker.", price: 16.25, category: "coffee", image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 160, featured: false, rating: 4.5 },
    { name: "Swiss Water Decaf", description: "Chemical-free decaf with notes of cocoa and caramel. Full flavor, no jitters.", price: 17.00, category: "coffee", image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 95, featured: false, rating: 4.3 },
    { name: "Organic Fair Trade Blend", description: "Certified organic and fair trade. Brown sugar sweetness, red fruit, and clean finish.", price: 18.25, category: "coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 130, featured: true, rating: 4.7 },
    { name: "Cold Brew Bean Blend", description: "Crafted for cold brew: velvety body, low acidity, with cocoa and caramel sweetness.", price: 16.75, category: "cold-brew", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 180, featured: true, rating: 4.7 },
    { name: "Ready-to-Drink Cold Brew (12oz Bottle)", description: "Smooth, slow-steeped cold brew with chocolatey sweetness and a clean finish.", price: 4.99, category: "cold-brew", image: "https://images.unsplash.com/photo-1494314671902-399b18174975?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 300, featured: false, rating: 4.5 },
    { name: "Nitro Cold Brew (12oz Can)", description: "Infused with nitrogen for a cascading, creamy texture and naturally sweet flavor.", price: 5.49, category: "cold-brew", image: "https://images.unsplash.com/photo-1557053964-937650b63311?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 280, featured: true, rating: 4.6 },
    { name: "Cold Brew Concentrate (32oz)", description: "Brew bar strength. Dilute 1:1 for a perfect cup at home. Rich cocoa and caramel notes.", price: 14.99, category: "cold-brew", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 140, featured: false, rating: 4.4 },
    { name: "Espresso Roast Coffee Pods (10ct)", description: "Convenient pods with a bold, chocolate-forward espresso profile. Compatible with most pod brewers.", price: 9.99, category: "espresso", image: "https://images.unsplash.com/photo-1494415859740-21e878dd929d?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 220, featured: false, rating: 4.2 },
    { name: "Classic French Press (1L)", description: "Stainless-steel mesh filter and borosilicate glass for a full-bodied, aromatic brew.", price: 34.00, category: "specialty", image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 60, featured: true, rating: 4.5 },
    { name: "Pour-Over Starter Set", description: "Ceramic dripper, glass carafe, and filters—everything you need for clean, sweet cups.", price: 39.00, category: "specialty", image: "https://images.unsplash.com/photo-1479118013749-9f39cf16ef2b?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 70, featured: true, rating: 4.6 },
    { name: "AeroPress Go", description: "Travel-ready brewer for rich, smooth coffee in under two minutes. Compact and durable.", price: 39.95, category: "specialty", image: "https://images.unsplash.com/photo-1576485436509-a1b3f9b9fe98?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 85, featured: false, rating: 4.7 },
    { name: "Hand Grinder (Conical Burr)", description: "Precision conical burrs for consistent grind from espresso to French press.", price: 59.00, category: "specialty", image: "https://images.unsplash.com/photo-1517705770914-3fe3d1d0b25f?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 55, featured: true, rating: 4.6 },
    { name: "Coffee Syrup Trio (Vanilla • Caramel • Hazelnut)", description: "Small-batch syrups made with pure cane sugar—balanced sweetness to elevate any drink.", price: 22.00, category: "specialty", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 140, featured: false, rating: 4.3 },
    { name: "Almond Oat Non-Dairy Creamer", description: "Creamy plant-based blend that steams beautifully and complements both hot and iced coffee.", price: 6.99, category: "specialty", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 180, featured: false, rating: 4.2 },
    { name: "Biscotti Assortment (12pc)", description: "Hand-baked biscotti dipped in dark chocolate—perfect crunch to pair with your coffee.", price: 12.00, category: "specialty", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 100, featured: false, rating: 4.4 },
    { name: "Coffee & Mug Gift Set", description: "A 12oz ceramic mug paired with our House Medium Roast—gift-ready packaging.", price: 29.00, category: "specialty", image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop", images: [], inStock: true, stockQuantity: 90, featured: true, rating: 4.6 }
  ].map((p, i) => ({ _id: `mem-${i + 1}`, reviews: [], ...p }))
};

module.exports = { store };


