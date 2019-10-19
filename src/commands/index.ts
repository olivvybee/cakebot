import { requireDirectory } from '../utils/files';
import { CommandModule } from '../interfaces';

const modules = requireDirectory(module);

const miscModule: CommandModule = {
  displayName: 'miscellaneous',
  description: "Standalone commands that aren't part of another module.",
  commands: []
};

const otherModules: CommandModule[] = [];

Object.keys(modules).forEach(key => {
  const exportedCommand = modules[key].default;
  if (exportedCommand) {
    miscModule.commands.push(exportedCommand);
  } else {
    const moduleExports = modules[key];
    const displayName = moduleExports.index.moduleName || key;
    const description =
      moduleExports.index.moduleDescription || 'No description given';

    const newModule: CommandModule = {
      displayName,
      description,
      commands: Object.keys(moduleExports)
        .filter(key => key !== 'index')
        .map(key => moduleExports[key])
    };
    if (newModule.commands.length) {
      otherModules.push(newModule);
    }
  }
});

export const commands = [miscModule, ...otherModules];
