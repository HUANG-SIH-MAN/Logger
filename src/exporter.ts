import fs from "fs";

export abstract class Exporter {
  public abstract exportLog(message: string): void;
}

export class CompositeExporter extends Exporter {
  private children_exporter: Exporter[] = [];
  constructor(...children_exporter: Exporter[]) {
    super();
    this.children_exporter.push(...children_exporter);
  }

  public exportLog(message: string) {
    this.children_exporter.forEach((exporter) => {
      exporter.exportLog(message);
    });
    return;
  }
}

export class ConsoleExporter extends Exporter {
  public exportLog(message: string) {
    console.log(message);
    return;
  }
}

export class FileExporter extends Exporter {
  private file_name: string;
  constructor(file_name: string) {
    super();
    this.file_name = file_name;
  }

  public exportLog(message: string) {
    fs.appendFileSync(this.file_name, message + "\n");
    return;
  }
}
