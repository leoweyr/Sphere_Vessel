import * as FileSystem from "fs-extra";
import * as Path from "path";


export class StartupConfiguration {
    private static instance: StartupConfiguration | undefined;
    public static readonly FILE_NAME: string = ".startup.json";

    public static async getInstance(startupConfigurationFilePath?: string): Promise<StartupConfiguration> {
        if (!startupConfigurationFilePath && !StartupConfiguration.instance) {
            throw new Error(
                "StartupConfiguration singleton instance not initialized."
            );
        } else if (!StartupConfiguration.instance) {
            StartupConfiguration.instance = new StartupConfiguration();
            await StartupConfiguration.instance.initialize(startupConfigurationFilePath!);
        }

        return StartupConfiguration.instance;
    }

    private rootPath: string | undefined;
    private httpApiPort: number | undefined;

    private async initialize(startupConfigurationFilePath: string): Promise<void> {
        let startupConfiguration: any = {};
        let isConfigurationMissing: boolean = false;

        if (await FileSystem.pathExists(startupConfigurationFilePath)) {
            startupConfiguration = await FileSystem.readJson(startupConfigurationFilePath);
        } else {
            isConfigurationMissing = true;
        }

        if (!startupConfiguration.rootPath) {
            startupConfiguration.rootPath = Path.dirname(startupConfigurationFilePath);
            isConfigurationMissing = true;
        }

        if (!startupConfiguration.httpApiPort) {
            startupConfiguration.httpApiPort = 80;
            isConfigurationMissing = true;
        }

        this.rootPath = startupConfiguration.rootPath;
        this.httpApiPort = startupConfiguration.httpApiPort;

        if (isConfigurationMissing) {
            await FileSystem.writeJson(startupConfigurationFilePath, startupConfiguration);
        }
    }

    public getRootPath(): string {
        return this.rootPath!;
    }

    public getHttpApiPort(): number {
        return this.httpApiPort!;
    }
}
