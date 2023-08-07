import { CompositeExporter, ConsoleExporter, FileExporter } from "./exporter";
import { StandardLayout } from "./layout";
import { Level, Logger } from "./logger";

const logger_map: { [name: string]: Logger } = {};

function declareLoggers(...loggers: Logger[]) {
  loggers.forEach((logger) => {
    logger_map[logger.name] = logger;
  });
}

function getLogger(name: string) {
  return logger_map[name];
}

const root = new Logger(
  null,
  undefined,
  Level.DEBUG,
  new StandardLayout(),
  new ConsoleExporter()
);

const gameLogger = new Logger(
  root,
  "app.game",
  Level.INFO,
  undefined,
  new CompositeExporter(
    new ConsoleExporter(),
    new CompositeExporter(
      new FileExporter("game.log"),
      new FileExporter("game.backup.log")
    )
  )
);

const aiLogger = new Logger(
  gameLogger,
  "app.game.ai",
  Level.TRACE,
  new StandardLayout()
);

declareLoggers(root, gameLogger, aiLogger);

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

  // constructor
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
