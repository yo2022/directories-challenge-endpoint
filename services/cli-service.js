import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

class CliService {

  async start(onLineEntered) {
    this.rl = readline.createInterface({ input, output });

    for await (const lineInput of this.rl) {
      const trimmedLineInput = lineInput.trim();
      if (trimmedLineInput.length > 0) {
        onLineEntered(trimmedLineInput);
      }
    }
  }

  stop() {
    if (this.rl) this.rl.close();
  }
}

export default CliService;
