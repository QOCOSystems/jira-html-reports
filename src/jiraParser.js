const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const xml2js = require('xml2js');
const parser = new xml2js.Parser();

function parseJiraIssue(issue) {
  const description = entities.decode(issue.description[0]);

  return {
    issueId: issue.key[0]._,
    title: issue.summary[0],
    description: !description || description.trim().length === 0 ? 'No description' : description,
    type: issue.type[0]._,
    status: issue.status[0]._,
    priority: issue.priority[0]._,
  };
}

function parseJiraData(jiraData) {
  return jiraData.rss.channel[0].item.map(parseJiraIssue)
}

function readJiraXml(data) {
  return new Promise((resolve, reject) => {
    parser.parseString(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function jiraParser(path) {
  return readJiraXml(path).then(parseJiraData);
}

module.exports = jiraParser;
