import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });
dotenv.config();

import express from "express";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

// Middleware
import { csrfProtection, getCsrfToken } from "./server/middleware/csrf.ts";
import { ssrfProtection } from "./server/middleware/ssrf.ts";

// API Routes
import authRoutes from "./server/routes/auth.ts";
import productRoutes from "./server/routes/products.ts";
import orderRoutes from "./server/routes/orders.ts";
import designRoutes from "./server/routes/designs.ts";
import profileRoutes from "./server/routes/profile.ts";
import uploadRoutes from "./server/routes/upload.ts";
import exportRoutes from "./server/routes/export.ts";
import adminRoutes from "./server/routes/admin.ts";
import { initStorage } from "./server/config/initStorage.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security headers
  const isProduction = process.env.NODE_ENV === 'production';
  app.use(helmet({
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: isProduction,
  }));

  // Disable X-Powered-By
  app.disable('x-powered-by');

  app.use(express.json({ limit: '50mb' }));
  app.use(cookieParser());

  // SSRF protection — block internal URLs in request bodies
  app.use(ssrfProtection);

  // CSRF token endpoint (client fetches this on load)
  app.get("/api/csrf-token", getCsrfToken);

  // Trust proxy — configurable for environments with multiple proxies
  app.set('trust proxy', parseInt(process.env.TRUST_PROXY_HOPS || '1', 10));

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/designs", designRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/export", exportRoutes);
  app.use("/api/admin", adminRoutes);

  // Serve Uploads
  app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Ensure local upload folders exist
  await initStorage();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
