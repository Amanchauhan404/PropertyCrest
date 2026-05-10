export function isRemoteImage(src: string) {
  return /^https?:\/\//i.test(src);
}
