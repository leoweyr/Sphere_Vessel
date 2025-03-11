import * as Path from "path";
import * as FileSystem from "fs-extra";

import { StartupConfiguration } from "@/control/StartupConfiguration";


jest.mock("fs-extra");
jest.mock("path");

describe("StartupConfiguration", (): void => {
    const mockConfigPath: string = "/test/path/.startup.json";
    const mockDefaultRoot: string = Path.dirname(mockConfigPath);
    const mockDefaultHttpApiPort: number = 80;

    beforeEach((): void => {
        StartupConfiguration["instance"] = undefined;
        jest.clearAllMocks();

        (Path.join as jest.Mock).mockImplementation((...args: string[]): string => args.join("/"));
    });

    describe("getInstance()", (): void => {
        it("should initialize instance when first called with valid path", async (): Promise<void> => {
            (FileSystem.pathExists as jest.Mock).mockResolvedValue(true);
            (FileSystem.readJson as jest.Mock).mockResolvedValue({ rootPath: "/custom/path" });

            const instance: StartupConfiguration = await StartupConfiguration.getInstance(mockConfigPath);
            expect(instance).toBeInstanceOf(StartupConfiguration);
            expect(instance.getRootPath()).toBe("/custom/path");
        });

        it("should return existing instance on subsequent calls without path", async (): Promise<void> => {
            await StartupConfiguration.getInstance(mockConfigPath);
            const instance2: StartupConfiguration = await StartupConfiguration.getInstance();
            expect(instance2).toBe(StartupConfiguration["instance"]);
        });

        it("should throw error when called without path before initialization", async (): Promise<void> => {
            await expect(StartupConfiguration.getInstance())
                .rejects.toThrow("StartupConfiguration singleton instance not initialized.");
        });
    });

    describe("initialize()", (): void => {
        it("should create default config when file missing", async (): Promise<void> => {
            (FileSystem.pathExists as jest.Mock).mockResolvedValue(false);

            const instance: StartupConfiguration = await StartupConfiguration.getInstance(mockConfigPath);
            expect(FileSystem.writeJson).toHaveBeenCalledWith(
                mockConfigPath,
                {
                    rootPath: mockDefaultRoot,
                    httpApiPort: mockDefaultHttpApiPort
                }
            );
            expect(instance.getRootPath()).toBe(mockDefaultRoot);
            expect(instance.getHttpApiPort()).toBe(mockDefaultHttpApiPort);
        });

        it("should inject default rootPath when missing in config", async (): Promise<void> => {
            (FileSystem.pathExists as jest.Mock).mockResolvedValue(true);
            (FileSystem.readJson as jest.Mock).mockResolvedValue({});

            const instance: StartupConfiguration = await StartupConfiguration.getInstance(mockConfigPath);
            expect(FileSystem.writeJson).toHaveBeenCalled();
            expect(instance.getRootPath()).toBe(mockDefaultRoot);
        });

        it("should inject default httpApiPort when missing in config", async (): Promise<void> => {
            (FileSystem.pathExists as jest.Mock).mockResolvedValue(true);
            (FileSystem.readJson as jest.Mock).mockResolvedValue({ rootPath: "/custom/path" });

            const instance: StartupConfiguration = await StartupConfiguration.getInstance(mockConfigPath);
            expect(FileSystem.writeJson).toHaveBeenCalled();
            expect(instance.getHttpApiPort()).toBe(mockDefaultHttpApiPort);
        });

        it("should use existing config without writing when complete", async (): Promise<void> => {
            const validConfig: { rootPath: string, httpApiPort: number } = {
                rootPath: "/valid/path",
                httpApiPort: 8080
            };
            (FileSystem.pathExists as jest.Mock).mockResolvedValue(true);
            (FileSystem.readJson as jest.Mock).mockResolvedValue(validConfig);

            const instance: StartupConfiguration = await StartupConfiguration.getInstance(mockConfigPath);
            expect(FileSystem.writeJson).not.toHaveBeenCalled();
            expect(instance.getRootPath()).toBe(validConfig.rootPath);
            expect(instance.getHttpApiPort()).toBe(validConfig.httpApiPort);
        });
    });

    describe("getRootPath()", (): void => {
        it("should return the rootPath", async (): Promise<void> => {
            const path: string = "/test/path";
            (FileSystem.pathExists as jest.Mock).mockResolvedValue(true);
            (FileSystem.readJson as jest.Mock).mockResolvedValue({ rootPath: path, httpApiPort: 80 });

            const instance: StartupConfiguration = await StartupConfiguration.getInstance(mockConfigPath);
            expect(instance.getRootPath()).toBe(path);
        });
    });

    describe("getHttpApiPort()", (): void => {
        it("should return the httpApiPort", async (): Promise<void> => {
            const port: number = 8080;
            (FileSystem.pathExists as jest.Mock).mockResolvedValue(true);
            (FileSystem.readJson as jest.Mock).mockResolvedValue({ rootPath: "/test/path", httpApiPort: port });

            const instance: StartupConfiguration = await StartupConfiguration.getInstance(mockConfigPath);
            expect(instance.getHttpApiPort()).toBe(port);
        });
    });
});
