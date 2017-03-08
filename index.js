#!/usr/bin/env node

const commandLineArgs = require('command-line-args');

const optionsDefinitions = [
  { name: 'inputFile', alias: 'i', type: String },
  { name: 'themePath', alias: 't', type: String },
  { name: 'outputPath', alias: 'o', type: String },
  { name: 'projectId', alias: 'p', type: String },
  { name: 'projectName', alias: 'n', type: String },
];

const options = commandLineArgs(optionsDefinitions);

const fileUtil = require('./src/fileUtil');
const jiraParser = require('./src/jiraParser');
const ReportProducer = require('./src/ReportProducer');

function validateCliArgs() {
  if (!options.inputFile) throw new Error('--inputFile (-i) must be set');
  if (!options.outputPath) throw new Error('--outputPath (-o) must be set');
  if (!options.themePath) throw new Error('--themePath (-t) must be set');
}

function execute() {
  validateCliArgs();

  const reportProducer = new ReportProducer({
    themePath: options.themePath,
    projectId: options.projectId,
    projectName: options.projectName,
  });

  fileUtil.readFileIfExists(options.inputFile)
    .then(jiraParser)
    .then(reportProducer.produce.bind(reportProducer))
    .then((reportHtml) => {
      return fileUtil.createDirectory(options.outputPath)
        .then(() => reportHtml);
    })
    .then((reportHtml) => {
      return fileUtil.writeFile(reportHtml, options.outputPath + '/index.html');
    })
    .then(() => {
      return fileUtil.copyDir(String(options.themePath) + '/assets', String(options.outputPath) + '/assets');
    })
    .catch((err) => {
      console.error(err);
    });
}

execute();
