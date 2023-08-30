export class FfmpegBuilder {
    private inputPath: string;
    private option: Map<string, string> = new Map();

    constructor() {
        this.option.set('-c:v', 'libx264')
    }

    input(inputPath: string): this {
        this.inputPath = inputPath;
        return this;
    }

    setVideoSize(width: number, height: number): this {
        this.option.set('-s', `${width}x${height}`);
        return this;
    }

    output(outputPath: string): string[] {
        if (!this.inputPath) {
            throw new Error('Не задан параметр input')
        }
        const args: string[] = ['-i', this.inputPath];
        this.option.forEach((value, key) => {
            args.push(key);
            args.push(value);
        });
        args.push(outputPath);
        return args;
    }
}
