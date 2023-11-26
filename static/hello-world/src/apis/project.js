import { requestJira } from '@forge/bridge';

export const ProjectPropertyApi = {
  extractEntityId: (context) => {
    return context.extension.project.id;
  },
  getPropertyKeys: async (projectId) => {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties`);
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
    const propertyPayload = await propertiesResponse.json();
    return propertyPayload.keys.map(p => p.key);
  },
  getProperty: async (projectId, propertyKey) => {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties/${encodeURIComponent(propertyKey)}`);
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
    return await propertiesResponse.json();
  },
  setProperty: async (projectId, propertyKey, data) => {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties/${encodeURIComponent(propertyKey)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': "application/json"
      }
    });
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
  },
  deleteProperty: async (projectId, propertyKey) => {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties/${encodeURIComponent(propertyKey)}`, {
      method: 'DELETE',
      headers: {
        'Content-type': "application/json"
      }
    });
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
  }
}