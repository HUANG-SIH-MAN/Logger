export abstract class Layout {
  public abstract formatMessage(
    message: string,
    logger_name: string,
    level: string
  ): string;
}

export class StandardLayout extends Layout {
  public formatMessage(message: string, logger_name: string, level: string) {
    return `${this.getCurrentDateTime()} |-${level} ${logger_name} - ${message}`;
  }

  private getCurrentDateTime(): string {
    return new Date().toISOString().slice(0, 23).replace("T", " ");
  }
}
