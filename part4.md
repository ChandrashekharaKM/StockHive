# Part 4: Reflection

The Firestore transaction for stock adjustments took longer than I expected — the naive `updateDoc` version was five minutes of work, but making the movement log actually atomic with the quantity change meant learning `runTransaction` properly, including how it retries on conflict. If I started again, I'd write the security rules first instead of last; I built the whole app against open test-mode rules and only tightened them at the end, which meant re-testing every write path against `request.auth != null` right before deploying instead of catching auth-shaped bugs earlier. 

The part of the stack I'm least confident in is Firestore data modelling at scale — specifically when to denormalize (e.g., storing a product name on the movement record) versus always joining back to the product doc. I'd like to dig into that more as it feels like the hardest part of building NoSQL architectures correctly from day one.
