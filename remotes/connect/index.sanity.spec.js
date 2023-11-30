const request = require('supertest');
const app = require('./index');

describe('Integration test for Express app', () => {
  it('should return a 302 status code for GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(302);
    expect(res.headers['location']).toEqual('/jira/atlassian-connect.json');
  });

  it('should return a descriptor JSON response for GET /jira/atlassian-connect.json', async () => {
    const res = await request(app).get('/jira/atlassian-connect.json');
    expect(res.status).toEqual(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.key).toEqual("com.atlassian.connect.entity-property-tool.local");
  });

  it('should return a page requesting panel/issue', async () => {
    const res = await request(app).get('/panel/project?project_id=proj_id_123&project_key=proj_key_456');
    expect(res.status).toEqual(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('<div class="panel panel-default property" data-property-key="{{key}}">');
  });

});
