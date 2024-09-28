export class RedirectError extends Error {
    status: number;
    redirectUrl: string;

  constructor(message: string, status: number, redirectUrl: string) {
    super(message);
    this.name = 'RedirectError';
    this.status = status;
    this.redirectUrl = redirectUrl;
  }
}