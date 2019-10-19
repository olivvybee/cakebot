import { requireDirectory } from '../utils/files';

const modules = requireDirectory(module);
export const listeners = Object.values(modules).map(
  importedModule => importedModule.default
);
