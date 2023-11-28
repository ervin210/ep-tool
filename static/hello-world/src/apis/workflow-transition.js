import { requestJira } from '@forge/bridge';

export function getWorkflowTransitionPropertyApi(workflowName, transitionId) {
  return {
    extractEntityId: () => {
      return transitionId;
    },
    getPropertyKeys: async (entityId) => {
      const propertiesResponse = await requestJira(`/rest/api/3/workflow/transitions/${entityId}/properties?workflowName=${workflowName}`);
      if (!propertiesResponse.ok) {
        throw new Error('Did not perform operation successfully');
      }
      const propertyPayload = await propertiesResponse.json();
      return propertyPayload.map(p => p.key);
    },
    getProperty: async (entityId, propertyKey) => {
      const propertiesResponse = await requestJira(`/rest/api/3/workflow/transitions/${entityId}/properties?workflowName=${workflowName}`);
      if (!propertiesResponse.ok) {
        throw new Error('Did not perform operation successfully');
      }
      const propertyPayload = await propertiesResponse.json();
      return propertyPayload.find(p => p.key === propertyKey);
    },
    setProperty: async (entityId, propertyKey, data) => {
      const propertiesResponse = await requestJira(`/rest/api/3/workflow/transitions/${entityId}/properties?workflowName=${workflowName}&key=${encodeURIComponent(propertyKey)}`, {
        method: 'PUT',
        body: JSON.stringify({
          value: data
        }),
        headers: {
          'Content-type': "application/json"
        }
      });
      if (!propertiesResponse.ok) {
        throw new Error('Did not perform operation successfully');
      }
    },
    deleteProperty: async (entityId, propertyKey) => {
      const propertiesResponse = await requestJira(`/rest/api/3/workflow/transitions/${entityId}/properties?workflowName=${workflowName}&key=${encodeURIComponent(propertyKey)}`, {
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