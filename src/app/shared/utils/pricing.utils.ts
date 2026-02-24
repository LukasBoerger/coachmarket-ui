export function formatPricingModel(model: string | null | undefined): string {
  switch (model) {
    case 'HOURLY':
      return 'pro Stunde';
    case 'MONTHLY':
      return 'pro Monat';
    case 'PACKAGE':
      return 'Paket';
    case 'ON_REQUEST':
      return 'auf Anfrage';
    default:
      return model ?? '';
  }
}
