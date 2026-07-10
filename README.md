# StockHive

A small inventory tracker built with Angular, Firebase Auth, and Firestore.

##Assignment link
https://drive.google.com/file/d/1Nf_3uIhMvcX4gZzGH7Mq4fsDI7IPHd4e/view?usp=drivesdk

## Live Demo
https://ai-engine-auth.web.app/

## Test Credentials
- **Email:** test@stockhive.com
- **Password:** password123

## Usage Guide
1. **Sign in** using the credentials above.
2. View the **Dashboard** which lists all products and highlights low-stock items in yellow/red.
3. Use the **Search bar** to find products by name or SKU, and use the **Low stock only** checkbox to filter.
4. Click **Add Product** to create a new item. The initial quantity is set here.
5. Back on the dashboard, use the **+1** or **-1** buttons to adjust stock. This updates the stock level and writes an atomic record to the movement log simultaneously.
6. Note: Firestore rules are locked down. You must be authenticated to read/write products, and you can only append to your own movement logs. Unauthenticated requests will fail.

## Setup Locally
1. Clone the repository.
2. Run `npm install`.
3. Provide your `firebaseConfig` in `src/app/app.config.ts`.
4. Run `ng serve` and navigate to `http://localhost:4200/`.
