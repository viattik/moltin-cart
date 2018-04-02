module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^.+\\.(s?css|less)$': 'utils/styleMock.js',
  },
};
