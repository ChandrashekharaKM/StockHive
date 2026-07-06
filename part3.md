# Part 3: Site Critique

**Observations from the page itself:**
- The hero section autoplays a video (`Whatsapp_Image-07.jpg` / an mp4 background), and the same promotional video URL (`b054506f6ac44125a674d50d66f21d35.mp4`) is reused across all six curriculum-category tabs (CBSE Science, CBSE Maths, CBSE Science Lab, NCERT Science, NCERT Maths, ICSE Science, State Boards) — every category shows an identical clip rather than category-specific content.
- The og:image referenced in the page metadata is a large 4167×2083 image, which is heavier than a social-preview image typically needs to be.
- The page is built on Shopify (cdn.shopify.com asset paths), which brings a full e-commerce cart/checkout flow to what's functioning as a marketing/lead-gen homepage — visible in the "Cart" and "Item added to your cart" UI sitting alongside educational program content.
- Navigation is shallow and clear (Schools / Teachers / Programmes / CBE Books / TnT), which is a genuine strength — no confusing mega-menu.

**UX/product gap:** the repeated stock video across every curriculum tab (CBSE Maths, NCERT Science, ICSE Science, etc.) undercuts the page's core pitch of hands-on, subject-specific learning — a visitor clicking through tabs to see what "NCERT Maths" activities actually look like gets the same footage as "CBSE Science Lab," which reads as unfinished or low-effort for a page selling curriculum depth.

**Concrete suggestion:** replace the single shared video asset with a short (10–15s) category-specific clip or, more cheaply, a 3-image carousel per tab showing the actual listed activities (e.g., "Cartesian Diver," "Goniometer Model" for Science Lab). This is a content/CMS change, not a code change — swap the `src` per tab in whatever Shopify section renders that block — and would take a content editor under an hour per category once the clips exist.
