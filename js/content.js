// GitHub Pages のプロジェクト配下でも動作する相対パスを使用する。
const root = new URL('../', import.meta.url);
export async function readData(name) {
  const response = await fetch(new URL(`data/${name}.json`, root), {cache: 'no-cache'});
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  return response.json();
}
export function galleryEntries(value) {
  if (!Array.isArray(value)) throw new Error('gallery.json は配列にしてください');
  return value.map((entry, index) => {
    if (!entry || typeof entry.path !== 'string' || !/^assets\/gallery\/[A-Za-z0-9_./-]+\.(?:jpe?g|png|webp|avif)$/i.test(entry.path) || entry.path.split('/').includes('..')) {
      throw new Error(`写真 ${index + 1}: assets/gallery/ 内の画像パスを指定してください`);
    }
    if (typeof entry.alt !== 'string' || !entry.alt.trim() || typeof entry.caption !== 'string' || !Number.isFinite(entry.order)) {
      throw new Error(`写真 ${index + 1}: alt、caption、数値のorderが必要です`);
    }
    if (entry.date !== null && entry.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) throw new Error(`写真 ${index + 1}: 日付はYYYY-MM-DD形式です`);
    return {...entry};
  }).sort((a, b) => a.order - b.order);
}
export function renderGallery(container, entries) {
  const fragment = document.createDocumentFragment();
  for (const entry of galleryEntries(entries)) {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = new URL(entry.path, root).href;
    image.alt = entry.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    if (Number.isInteger(entry.width) && entry.width > 0 && Number.isInteger(entry.height) && entry.height > 0) {
      image.width = entry.width;
      image.height = entry.height;
    }
    const caption = document.createElement('figcaption');
    caption.textContent = entry.caption;
    figure.append(image, caption);
    fragment.append(figure);
  }
  container.replaceChildren(fragment);
}
export function publicLink(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    return ['https:', 'mailto:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
