// @astrojs/vercel 9.x scrive la regola "immutable" per /_astro/ DOPO `handle: filesystem`
// in .vercel/output/config.json: i file statici vengono serviti prima e l'header non arriva mai.
// Questo script la sposta prima del filesystem. Da rimuovere se l'adapter lo corregge.
import { readFile, writeFile } from "node:fs/promises";

const path = new URL("../.vercel/output/config.json", import.meta.url);
const config = JSON.parse(await readFile(path, "utf8"));
const routes = config.routes ?? [];

const fsIndex = routes.findIndex((r) => r.handle === "filesystem");
const cacheIndex = routes.findIndex(
	(r) => r.src === "^/_astro/(.*)$" && r.headers?.["cache-control"]?.includes("immutable"),
);

if (fsIndex === -1 || cacheIndex === -1) {
	console.warn("[fix-vercel-asset-cache] regola o filesystem non trovati, nessuna modifica");
} else if (cacheIndex > fsIndex) {
	const [cacheRoute] = routes.splice(cacheIndex, 1);
	routes.splice(fsIndex, 0, cacheRoute);
	await writeFile(path, JSON.stringify(config, null, "\t"));
	console.log("[fix-vercel-asset-cache] cache immutable per /_astro/ spostata prima del filesystem");
}
