import fs from "fs";

export abstract class Exporter {
  static createExporter(config?: { [key: string]: any }) {
    if (!config) return;

    if (config.type === "console") {
      return new ConsoleExporter();
    }

    if (config.type === "file") {
      return new FileExporter(config.fileName);
    }

    if (config.type === "composite") {
      const children_exporter = config.children
        .map((children_config: { [key: string]: any } | undefined) =>
          Exporter.createExporter(children_config)
        )
        .filter((item: any) => item);
      return new CompositeExporter(...children_exporter);
    }

    return;
  }
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
