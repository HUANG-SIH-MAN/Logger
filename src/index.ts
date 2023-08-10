import {
  CompositeExporter,
  ConsoleExporter,
  FileExporter,
  Exporter,
} from "./exporter";
import { StandardLayout, Layout } from "./layout";
import { Level, Logger } from "./logger";
import * as fs from "fs-extra";

const logger_map: { [name: string]: Logger } = {};

function declareLoggers(...loggers: Logger[]) {
  loggers.forEach((logger) => {
    logger_map[logger.name] = logger;
  });
}

function getLogger(name: string) {
  return logger_map[name];
}

function declareLoggersByFile(fine_name: string) {
  const config: { [key: string]: Object } = JSON.parse(
    fs.readFileSync(fine_name, "utf-8")
  );
  createLogger("root", Object.values(config)[0]);
}

function createLogger(
  logger_name: string,
  config: { [key: string]: any },
  parent: Logger | null = null
) {
  const level_threshold = config["levelThreshold"]
    ? Level[config["levelThreshold"] as keyof typeof Level]
    : undefined;
  const layout = Layout.createLayout(config["layout"]);
  const exporter = Exporter.createExporter(config["exporter"]);

  const logger = new Logger(
    parent,
    logger_name,
    level_threshold,
    layout,
    exporter
  );
  declareLoggers(logger);

  const children_logger_name = Object.keys(config).filter(
    (key) => key !== "levelThreshold" && key !== "layout" && key !== "exporter"
  )[0];

  if (children_logger_name) {
    return createLogger(
      children_logger_name,
      config[children_logger_name],
      logger
    );
  }

  return;
}

// TODO: 用json檔案設定logger
declareLoggersByFile("logger.json");

// TODO: 直接宣告logger
// const root = new Logger(
//   null,
//   undefined,
//   Level.DEBUG,
//   new StandardLayout(),
//   new ConsoleExporter()
// );

// const gameLogger = new Logger(
//   root,
//   "app.game",
//   Level.INFO,
//   undefined,
//   new CompositeExporter(
//     new ConsoleExporter(),
//     new CompositeExporter(
//       new FileExporter("game.log"),
//       new FileExporter("game.backup.log")
//     )
//   )
// );

// const aiLogger = new Logger(
//   gameLogger,
//   "app.game.ai",
//   Level.TRACE,
//   new StandardLayout()
// );

// declareLoggers(root, gameLogger, aiLogger);

class Game {
  private log: Logger = getLogger("app.game");
  private players: AI[] = [
    new AI("AI 1"),
    new AI("AI 2"),
    new AI("AI 3"),
    new AI("AI 4"),
  ];

  start() {
    this.log.info("The game begins.");
    for (const ai of this.players) {
      this.log.trace(`The player *${ai.getName()}* begins his turn.`);
      ai.makeDecision();
      this.log.trace(`The player *${ai.getName()}* finishes his turn.`);
    }
    this.log.debug("Game ends.");
  }
}

class AI {
  private log: Logger = getLogger("app.game.ai");
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  makeDecision() {
    this.log.trace(`${this.name} starts making decisions...`);
    this.log.warn(`${this.name} decides to give up.`);
    this.log.error(`Something goes wrong when ${this.name} gives up.`);

    this.log.trace(`${this.name} completes its decision.`);
  }

  getName() {
    return this.name;
  }
}

const game = new Game();
game.start();
