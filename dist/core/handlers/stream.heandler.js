"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamHandler = void 0;
class StreamHandler {
    constructor(logger) {
        this.logger = logger;
    }
    processOutput(stream) {
        stream.stdout.on('data', (data) => {
            this.logger.log(data);
        });
        stream.stderr.on('data', (data) => {
            this.logger.error(data);
        });
        stream.on('close', (data) => {
            this.logger.end();
        });
    }
}
exports.StreamHandler = StreamHandler;
