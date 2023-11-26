import { requestJira } from '@forge/bridge';

export function getUserPropertyApi(userId) {
  return {
    extractEntityId: () => {
      return userId;
    },
    getPropertyKeys: async (entityId) => {
      const propertiesResponse = await requestJira(`/rest/api/3/project/${entityId}/properties`);
      if (!propertiesResponse.ok) {
        throw new Error('Did not perform operation successfully');
      }
      const propertyPayload = await propertiesResponse.json();
      return propertyPayload.keys.map(p => p.key);
    },
    getProperty: async (entityId, propertyKey) => {
      const propertiesResponse = await requestJira(`/rest/api/3/project/${entityId}/properties/${encodeURIComponent(propertyKey)}`);
      if (!propertiesResponse.ok) {
        throw new Error('Did not perform operation successfully');
      }
      return await propertiesResponse.json();
    },
    setProperty: async (entityId, propertyKey, data) => {
      const propertiesResponse = await requestJira(`/rest/api/3/project/${entityId}/properties/${encodeURIComponent(propertyKey)}`, {
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
    deleteProperty: async (entityId, propertyKey) => {
      const propertiesResponse = await requestJira(`/rest/api/3/project/${entityId}/properties/${encodeURIComponent(propertyKey)}`, {
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
}