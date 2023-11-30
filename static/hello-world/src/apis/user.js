import { requestJira } from '@forge/bridge';

export function getUserPropertyApi (accountId) {
  return {
    extractEntityId: () => {
      return accountId;
    },
    getPropertyKeys: async (entityId) => {
      const propertiesResponse = await requestJira(`/rest/api/3/user/properties?accountId=${accountId}`);
      if (!propertiesResponse.ok) {
        throw new Error('Did not perform operation successfully');
      }
      const propertyPayload = await propertiesResponse.json();
      return propertyPayload.keys.map(p => p.key);
    },
    getProperty: async (entityId, propertyKey) => {
      const propertiesResponse = await requestJira(`/rest/api/3/user/properties/${encodeURIComponent(propertyKey)}?accountId=${accountId}`);
      if (!propertiesResponse.ok) {
        throw new Error('Did not perform operation successfully');
      }
      return await propertiesResponse.json();
    },
    setProperty: async (entityId, propertyKey, data) => {
      const propertiesResponse = await requestJira(`/rest/api/3/user/properties/${encodeURIComponent(propertyKey)}?accountId=${accountId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json'
        }
      });
      if (!propertiesResponse.ok) {
        throw new Error('Did not perform operation successfully');
      }
    },
    deleteProperty: async (entityId, propertyKey) => {
      const propertiesResponse = await requestJira(`/rest/api/3/user/properties/${encodeURIComponent(propertyKey)}?accountId=${accountId}`, {
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
}
