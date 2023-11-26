
import React, { useEffect, useState } from 'react';
import { view, Modal } from '@forge/bridge';
import { useEffectAsync } from './useEffectAsync';
import { isPresent } from 'ts-is-present';
import { Property } from './Property';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';
import Button from '@atlaskit/button';
import { TYPE_CREATE } from './AddPropertyModal';

function App(props) {
  const { propertyApi } = props;
  const [entityPropertyState, setEntityPropertyState] = useState(undefined);

  async function loadEntityPropertyState() {
    const context = await view.getContext();
    console.log('context', context);
    const entityId = propertyApi.extractEntityId(context);
    return {
      entityId,
      keys: await propertyApi.getPropertyKeys(entityId)
    };
  }

  useEffect(() => {
    loadEntityPropertyState().then(setEntityPropertyState);
  }, [propertyApi]);

  useEffectAsync(async () => {
    setEntityPropertyState(await loadEntityPropertyState());
  }, entityPropertyState);

  async function onDelete(propertyKey) {
    await propertyApi.deleteProperty(entityPropertyState.entityId, propertyKey);
    setEntityPropertyState(await loadEntityPropertyState());
  }

  const addPropertyClosed = async (payload) => {
    if (payload.type === TYPE_CREATE) {
      const { propertyKey, propertyValue } = payload.data;

      // TODO what if this fails?
      await propertyApi.setProperty(entityPropertyState.entityId, propertyKey, JSON.parse(propertyValue));

      setEntityPropertyState(await loadEntityPropertyState());
    }
  };

  const addPropertyModal = new Modal({
    onClose: (payload) => addPropertyClosed(payload),
    size: 'medium',
    context: {
      type: 'add-property'
    }
  });

  return (
    <div>
      <p>These are the entity properties for this project.</p>
      {!isPresent(entityPropertyState) && (
        <div>Loading the properties for this project...</div>
      )}
      {isPresent(entityPropertyState) && (
        <>
          <Button iconBefore={<EditorAddIcon />} onClick={() => addPropertyModal.open()}>Add property</Button>
          {entityPropertyState.keys.map(key => (
            <Property
              key={`${key}`}
              entityId={entityPropertyState.entityId}
              propertyKey={key}
              propertyApi={propertyApi}
              onDelete={() => onDelete(key)}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
