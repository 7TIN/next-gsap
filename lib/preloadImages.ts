export async function preloadImages(urls: string[]) {
  const promises = urls.map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
      })
  );
  await Promise.all(promises);
}
