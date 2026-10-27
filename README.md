# FoodDash — Full-stack food delivery demo

A responsive food-delivery storefront built with **React + Vite** and a **Node.js + Express REST API**. Includes 12 menu items with food photos, search, category filters, favourites, shopping basket, quantity controls, checkout, and order saving to a local JSON file.

## Requirements
- Node.js 18 or newer
- npm
- Internet connection for food photos and Google Fonts

## Run in VS Code (Windows)
1. Extract this ZIP.
2. Open the extracted `fooddash-fullstack` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Install dependencies from the project root:
   ```bash
   npm run install:all
   ```
5. Start the frontend and backend together:
   ```bash
   npm run dev
   ```
6. Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` to test it.

## API routes
- `GET /api/health` — health check
- `GET /api/products` — menu; optional `q` and `category` query parameters
- `GET /api/orders` — list saved demo orders
- `POST /api/orders` — validate and save an order to `server/orders.json`

## Push to GitHub
Create an empty repository on GitHub, then run these commands in the project root (replace the URL with your own repository URL):
```bash
git init
git add .
git commit -m "Add FoodDash full-stack food delivery app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Deploy notes
- **Frontend:** deploy `client` to Vercel or Netlify. Set `VITE_API_URL` to your deployed backend URL (no trailing slash), then build with `npm run build`.
- **Backend:** deploy `server` to a Node.js host such as Render. Start command: `npm start`; configure `PORT` if the host supplies it. Set the frontend's `VITE_API_URL` to the backend URL and redeploy the frontend.
- This is a learning/demo app. Orders are stored in a local JSON file; use a persistent database and authentication before production deployment. Payment is not processed; payment options are demo selections only.

## Project structure
```
fooddash-fullstack/
├── client/              # React + Vite website
│   ├── src/main.jsx     # UI, menu, cart, checkout
│   └── src/styles.css   # Responsive styling
├── server/
│   ├── index.js         # Express API
│   └── orders.json      # Created automatically for saved orders
├── package.json         # Root scripts
└── README.md
```


## Order tracking feature

- After checkout, FoodDash shows your new order ID and opens the **Track order** section.
- You can also enter an order ID (for example, `FD12345678`) in the tracker. The backend looks up the saved order through `GET /api/orders/:id`.
- The tracker refreshes the order status every 10 seconds while the page is open. Your latest order ID is saved in this browser so it is easier to return to tracking.
- The progress timeline displays the order stages: Order received, Preparing, Ready for pickup, Out for delivery, and Delivered.
- **Demo limitation:** this project does not connect to a real restaurant dashboard or rider GPS. Statuses will not progress automatically unless the backend order data is updated. Real-time rider location requires a delivery-partner app/GPS integration and authenticated status updates.
