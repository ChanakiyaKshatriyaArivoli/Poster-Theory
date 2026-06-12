import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.ts";
import cloudinary from "./cloudinary.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../");

export const UPLOADS_DIR = path.join(ROOT, "public/uploads");

export const ensureCollectionFolder = (slug: string) => {
  const dir = path.join(UPLOADS_DIR, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

export const initStorage = async () => {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  try {
    const { rows } = await pool.query("SELECT slug FROM collections");

    // Ensure local folders exist
    for (const row of rows) {
      ensureCollectionFolder(row.slug);
    }

    // Skip Cloudinary folder creation in production (already exists)
    if (process.env.NODE_ENV !== 'production') {
      const baseFolders = [
        "poster-theory/products",
        "poster-theory/custom",
        "poster-theory/homepage",
        "poster-theory/homepage/hero_images",
        "poster-theory/homepage/collection_images",
        "poster-theory/homepage/about_image",
      ];

      for (const folder of baseFolders) {
        try { await cloudinary.api.create_folder(folder); } catch (_) {}
      }

      for (const row of rows) {
        try { await cloudinary.api.create_folder(`poster-theory/products/${row.slug}`); } catch (_) {}
      }
    }

    console.log(`Storage synced: ${rows.length} collections`);
  } catch (err) {
    console.log("Local uploads base folder created (DB not ready for full sync)");
  }
};
