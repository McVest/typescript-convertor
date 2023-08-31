import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { FfmpegBuilder } from '../../commands/ffmpeg/ffmpeg.builder';
import { FileService } from '../files/file.service';
import { IStreamLogger } from '../handlers/stream-logger.interface';
import { PromptService } from '../prompt/prompt.service';
import { CommandExecutor } from './command.excutor';
import { ICommandExecFfmpeg, IFfmpegInput } from './ffmpeg.types';
import { StreamHandler } from '../handlers/stream.heandler';


export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {
    private fileService: FileService = new FileService();
    private promptService: PromptService = new PromptService();

    constructor(logger: IStreamLogger) {
        super(logger);
    }

    protected async prompt(): Promise<IFfmpegInput> {
        const width = await this.promptService.input<number>('Ширина', 'number');
        const height = await this.promptService.input<number>('Высота', 'number');
        const path = await this.promptService.input<string>('Путь до файла', 'input');
        const name = await this.promptService.input<string>('Имя', 'input');
        return { width, height, path, name };
    }

    protected build({ width, height, path, name }: IFfmpegInput): ICommandExecFfmpeg {
        const output = this.fileService.getFilePath(path, name, 'mp4');
        const args = (new FfmpegBuilder)
            .input(path)
            .setVideoSize(width, height)
            .output(output);
        return { command: 'ffmpeg', args, output };
    }

    protected spawn({ output, command: commmand, args }: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
        this.fileService.deleteFileIfExists(output);
        return spawn(commmand, args);
    }

    protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
        const handler = new StreamHandler(logger);
        handler.processOutput(stream);
    }
}