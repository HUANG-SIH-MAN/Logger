import { Layout } from "./layout";
import { Exporter } from "./exporter";

export enum Level {
  TRACE = 1,
  INFO = 2,
  DEBUG = 3,
  WARN = 4,
  ERROR = 5,
}

const levelToString = {
  [Level.TRACE]: "TRACE",
  [Level.INFO]: "INFO",
  [Level.DEBUG]: "DEBUG",
  [Level.WARN]: "WARN",
  [Level.ERROR]: "ERROR",
};

export class Logger {
  private _name: string;
  private parent: Logger | null;
  private _level_threshold: Level;
  private _layout: Layout;
  private _exporter: Exporter;

  constructor(
    parent: Logger | null,
    name: string = "",
    level_threshold?: Level,
    layout?: Layout,
    exporter?: Exporter
  ) {
    this.parent = parent;
    this._name = parent ? name : "root";
    this._level_threshold = level_threshold
      ? level_threshold
      : parent!.level_threshold;
    this._layout = layout ? layout : parent!.layout;
    this._exporter = exporter ? exporter : parent!.exporter;
  }

  public trace(message: string) {
    this.exportLog(message, Level.TRACE);
    return;
  }

  public info(message: string) {
    this.exportLog(message, Level.INFO);
    return;
  }

  public debug(message: string) {
    this.exportLog(message, Level.DEBUG);
    return;
  }

  public warn(message: string) {
    this.exportLog(message, Level.WARN);
    return;
  }

  public error(message: string) {
    this.exportLog(message, Level.ERROR);
    return;
  }

  private exportLog(message: string, level: Level) {
    if (this._level_threshold <= level) {
      const format_message = this._layout.formatMessage(
        message,
        this._name,
        levelToString[level]
      );
      this._exporter.exportLog(format_message);
    }
    return;
  }

  get level_threshold() {
    return this._level_threshold;
  }

  get layout() {
    return this._layout;
  }

  get exporter() {
    return this._exporter;
  }

  get name() {
    return this._name;
  }
}
