'use strict';

const pug = require('pug');
const moment = require('moment');

const fileUtil = require('./fileUtil');

class ReportProducer {
  constructor(opts) {
    this.opts = opts;
  }

  produce(issues) {
    const templateFile = String(this.opts.themePath) + '/template.pug';

    return fileUtil
      .fileExists(templateFile)
      .then(() => {
        const obj = {
          printedAt: moment().format('YYYY-MM-DD HH:mm'),
          projectId: this.opts.projectId,
          projectName: this.opts.projectName,

          issues
        };

        return pug.renderFile(templateFile, obj);
      });
  }
}

module.exports = ReportProducer;
