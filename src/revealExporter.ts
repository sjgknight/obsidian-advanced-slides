import { emptyDir, copy, writeFile } from 'fs-extra';
import path from 'path';
import { ObsidianUtils } from './obsidianUtils';

export class RevealExporter {
	private pluginDirectory: string;
	private exportDirectory: string;
	private vaultDirectory: string;

	constructor(utils: ObsidianUtils) {
		this.pluginDirectory = utils.getPluginDirectory();
		this.exportDirectory = utils.getExportDirectory();
		this.vaultDirectory = utils.getVaultDirectory();
	}

	public async export(filePath: string, html: string, imgList: string[]) {
		const ext = path.extname(filePath);
		const folderDir = this.exportDirectory;
		const folderName = path.basename(filePath).replaceAll(ext, '');
		const htmlFileName = folderName + '.html';
		const assetsDir = path.join(this.exportDirectory, 'common_assets');

		// Ensure the common assets directory exists and is populated
	    await emptyDir(assetsDir);
	    await copy(path.join(this.pluginDirectory, 'css'), path.join(assetsDir, 'css'));
	    await copy(path.join(this.pluginDirectory, 'dist'), path.join(assetsDir, 'dist'));
	    await copy(path.join(this.pluginDirectory, 'plugin'), path.join(assetsDir, 'plugin'));

	    // Write the HTML file to the export directory
	    await writeFile(path.join(this.exportDirectory, htmlFileName), html);

		await copy(path.join(this.pluginDirectory, 'css'), path.join(folderDir, 'css'));
		await copy(path.join(this.pluginDirectory, 'dist'), path.join(folderDir, 'dist'));
		await copy(path.join(this.pluginDirectory, 'plugin'), path.join(folderDir, 'plugin'));

    // Copy images to a shared directory
    const imgDir = path.join(this.exportDirectory, 'images');
    await emptyDir(imgDir);
    for (const img of imgList) {
        if (img.startsWith('http')) continue;
        await copy(path.join(this.vaultDirectory, img), path.join(imgDir, img));
    }


    window.open('file://' + path.join(this.exportDirectory, htmlFileName));
	}
}
