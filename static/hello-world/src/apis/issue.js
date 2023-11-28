import { requestJira } from '@forge/bridge';

export const IssuePropertyApi = {
  extractEntityId: (context) => {
    return context.extension.issue.id;
  },
  getPropertyKeys: async (issueId) => {
    const propertiesResponse = await requestJira(`/rest/api/3/issue/${issueId}/properties`);
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
    const propertyPayload = await propertiesResponse.json();
    return propertyPayload.keys.map(p => p.key);
  },
  getProperty: async (issueId, propertyKey) => {
    const propertiesResponse = await requestJira(`/rest/api/3/issue/${issueId}/properties/${encodeURIComponent(propertyKey)}`, {
      headers: {
        Accept: 'application/json'
      }
    });
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
    return await propertiesResponse.json();
  },
  setProperty: async (issueId, propertyKey, data) => {
    const propertiesResponse = await requestJira(`/rest/api/3/issue/${issueId}/properties/${encodeURIComponent(propertyKey)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
      }
    });
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
  },
  deleteProperty: async (issueId, propertyKey) => {
    const propertiesResponse = await requestJira(`/rest/api/3/issue/${issueId}/properties/${encodeURIComponent(propertyKey)}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    });
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
  }
};
